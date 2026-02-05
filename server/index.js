import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { conversationQueries, messageQueries } from './database.js'
import { getSystemPrompt } from './roles.js'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = 3001

// 中间件
app.use(cors())
app.use(express.json())

// ==================== 对话 API ====================

// 获取所有对话
app.get('/api/conversations', (req, res) => {
  try {
    const conversations = conversationQueries.getAll.all()
    res.json(conversations)
  } catch (error) {
    console.error('获取对话列表失败:', error)
    res.status(500).json({ error: '获取对话列表失败' })
  }
})

// 创建新对话
app.post('/api/conversations', (req, res) => {
  try {
    const { title = '新对话' } = req.body
    const result = conversationQueries.create.run(title)
    const newConversation = conversationQueries.getById.get(result.lastInsertRowid)
    res.json(newConversation)
  } catch (error) {
    console.error('创建对话失败:', error)
    res.status(500).json({ error: '创建对话失败' })
  }
})

// 更新对话标题
app.patch('/api/conversations/:id', (req, res) => {
  try {
    const { id } = req.params
    const { title } = req.body
    conversationQueries.updateTitle.run(title, id)
    const updated = conversationQueries.getById.get(id)
    res.json(updated)
  } catch (error) {
    console.error('更新对话失败:', error)
    res.status(500).json({ error: '更新对话失败' })
  }
})

// 删除对话
app.delete('/api/conversations/:id', (req, res) => {
  try {
    const { id } = req.params
    conversationQueries.delete.run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('删除对话失败:', error)
    res.status(500).json({ error: '删除对话失败' })
  }
})

// ==================== 消息 API ====================

// 获取对话的所有消息
app.get('/api/conversations/:id/messages', (req, res) => {
  try {
    const { id } = req.params
    const messages = messageQueries.getByConversation.all(id)
    res.json(messages)
  } catch (error) {
    console.error('获取消息列表失败:', error)
    res.status(500).json({ error: '获取消息列表失败' })
  }
})

// 创建消息
app.post('/api/conversations/:id/messages', (req, res) => {
  try {
    const { id } = req.params
    const { role, content } = req.body

    // 验证参数
    if (!role || !content) {
      return res.status(400).json({ error: '缺少必要参数' })
    }
    if (role !== 'user' && role !== 'assistant') {
      return res.status(400).json({ error: 'role 必须是 user 或 assistant' })
    }

    // 创建消息
    const result = messageQueries.create.run(id, role, content)

    // 更新对话的最后活跃时间
    conversationQueries.updateTimestamp.run(id)

    // 返回创建的消息
    res.json({
      id: result.lastInsertRowid,
      conversation_id: parseInt(id),
      role,
      content,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('创建消息失败:', error)
    res.status(500).json({ error: '创建消息失败' })
  }
})

// ==================== AI 聊天 API ====================

// 流式调用 DeepSeek API (SSE)
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { conversationId, message, role: aiRole } = req.body

    if (!message) {
      return res.status(400).json({ error: '消息内容不能为空' })
    }

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // 获取对话历史
    const history = conversationId
      ? messageQueries.getByConversation.all(conversationId)
      : []

    // 获取对应角色的系统提示词
    const systemPrompt = getSystemPrompt(aiRole)

    // 构建消息数组
    const messages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...history.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    // 调用 DeepSeek API（流式）
    const response = await fetch(`${process.env.DEEPSEEK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        stream: true  // 启用流式输出
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepSeek API 错误:', error)
      res.write(`data: ${JSON.stringify({ error: 'API 调用失败' })}\n\n`)
      res.end()
      return
    }

    // 读取流式响应并转发给客户端
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n')
          } else {
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`)
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }
    }

    res.end()
  } catch (error) {
    console.error('AI 聊天失败:', error)
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
    res.end()
  }
})

// 非流式调用（保留兼容）
app.post('/api/chat', async (req, res) => {
  try {
    const { conversationId, message, role: aiRole } = req.body

    if (!message) {
      return res.status(400).json({ error: '消息内容不能为空' })
    }

    const history = conversationId
      ? messageQueries.getByConversation.all(conversationId)
      : []

    // 获取对应角色的系统提示词
    const systemPrompt = getSystemPrompt(aiRole)

    const messages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...history.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const response = await fetch(`${process.env.DEEPSEEK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepSeek API 错误:', error)
      throw new Error(`DeepSeek API 返回错误: ${response.status}`)
    }

    const data = await response.json()
    const aiMessage = data.choices[0].message.content

    res.json({
      content: aiMessage,
      role: 'assistant'
    })
  } catch (error) {
    console.error('AI 聊天失败:', error)
    res.status(500).json({
      error: 'AI 聊天失败',
      details: error.message
    })
  }
})

// 生成对话标题
app.post('/api/chat/title', async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: '消息内容不能为空' })
    }

    const response = await fetch(`${process.env.DEEPSEEK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '根据用户的第一条消息，生成一个简短的对话标题（不超过15个字）。只输出标题本身，不要加引号或其他内容。'
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    })

    if (!response.ok) {
      throw new Error('生成标题失败')
    }

    const data = await response.json()
    const title = data.choices[0].message.content.trim()

    res.json({ title })
  } catch (error) {
    console.error('生成标题失败:', error)
    res.status(500).json({ error: '生成标题失败' })
  }
})

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API 服务运行正常' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务器运行在 http://localhost:${PORT}`)
  console.log(`📊 API 文档: http://localhost:${PORT}/api/health`)
})
