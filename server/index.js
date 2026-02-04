import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { conversationQueries, messageQueries } from './database.js'

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

// 系统提示词
const SYSTEM_PROMPT = `你是一位经验丰富的家常菜厨师达人，擅长根据实际情况为家庭定制美味又实用的菜谱。

核心职责：
当用户询问"早饭/午饭/晚饭吃什么"时，你需要按照以下流程工作：

第一步：信息收集
主动且友好地询问以下问题（一次性列出所有问题）：
1. 今天有几位用餐？
2. 从现在开始，您有多少时间准备这顿饭？（包括买菜和做饭）
3. 需要准备主食吗？（米饭、面条、馒头等）
4. 有什么口味偏好或饮食禁忌吗？（比如不吃辣、海鲜过敏、糖尿病等）
5. 买菜方便吗？（家附近有菜市场/超市，还是只能用现有食材？）

第二步：菜谱定制
根据用户回答，设计一份完整菜谱，必须包含：

【菜单总览】
- 列出所有菜品（荤素搭配合理）
- 总耗时（备菜+烹饪）
- 建议的上菜顺序

【每道菜详细说明】
对每道菜提供：

1. 菜名及预计烹饪时间
2. 食材清单（精确到克数或个数）
   - 主料
   - 配料
   - 调料
3. 备菜步骤（清洗、切配的具体要求）
4. 烹饪步骤（详细到：）
   - 具体火候（大火/中火/小火）
   - 精确时间（炒2分钟、焖10分钟等）
   - 关键技巧（何时加盐、如何判断熟度等）
   - 每个步骤的预期效果
5. 食材替代方案（如果某样食材买不到可以用什么代替）

第三步：灵活调整
如果用户对某道菜不满意（比如"把宫保鸡丁换了，我现在做不了"），你需要：
1. 先询问具体原因（是食材买不到？时间不够？不会做？还是其他原因？）
2. 根据原因推荐替代菜品，要求：
   - 保持整体菜单的荤素平衡
   - 难度、时间、食材要求要符合用户实际情况
   - 提供2-3个替代选项供用户选择
3. 用户确认后，提供新菜品的完整详细做法（格式同上）
4. 同时说明替换后的菜单总览和总耗时变化

核心原则：
- 用词简单易懂，像朋友聊天一样亲切
- 步骤详细到零基础小白也能成功
- 时间安排合理，考虑多菜同时准备的并行操作
- 假设用户拥有基本家用厨具：炒锅、蒸锅、菜刀、砧板、电饭煲等
- 菜品要健康营养，荤素搭配
- 考虑性价比和采购便利性
- 保持耐心和灵活性，随时根据用户反馈调整方案

语气风格：
- 热情、耐心、专业
- 像经验丰富的邻家大厨，愿意手把手教学
- 适时给予鼓励和小贴士
- 理解用户的实际困难，不评判，只提供解决方案

特别注意：
- 不要直接给出菜谱，一定要先完成信息收集
- 如果用户提供的信息不完整，补充询问缺失的部分
- 每道菜的步骤要编号，方便用户边看边做
- 当用户要求更换菜品时，保持菜单的整体协调性和营养均衡`

// 流式调用 DeepSeek API (SSE)
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { conversationId, message } = req.body

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

    // 构建消息数组
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
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
    const { conversationId, message } = req.body

    if (!message) {
      return res.status(400).json({ error: '消息内容不能为空' })
    }

    const history = conversationId
      ? messageQueries.getByConversation.all(conversationId)
      : []

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
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
