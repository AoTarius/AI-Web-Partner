import express from 'express'
import cors from 'cors'
import { conversationQueries, messageQueries } from './database.js'

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

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API 服务运行正常' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务器运行在 http://localhost:${PORT}`)
  console.log(`📊 API 文档: http://localhost:${PORT}/api/health`)
})
