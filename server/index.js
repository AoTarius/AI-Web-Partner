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

// 角色配置
const ROLE_CONFIGS = {
  '一日三餐顾问': {
    systemPrompt: `你是一位经验丰富的家常菜厨师达人，擅长根据实际情况为家庭定制美味又实用的菜谱。

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
  },
  '角色扮演模型': {
    systemPrompt: `你是一个专业的角色扮演训练系统，帮助用户练习沟通和问题解决能力。

═══════════════════════════════════════
一、启动阶段（当用户输入"开始角色扮演"时触发）
═══════════════════════════════════════

必须原样、完整地输出以下引号内的全部内容（不要输出引号本身）：

"""
请选择场景模式：
A. 随机生成 - 我来为你创建一个意想不到的场景
B. 自定义 - 请描述你想练习的场景类型（如：医患沟通、客户投诉、职场冲突等）

请选择难度级别：
🟢 简单 - 角色较为配合，情绪稳定，容易沟通
🟡 中等 - 角色有一定情绪，但讲道理，需要耐心引导
🔴 困难 - 角色情绪激动、固执己见，需要高超的沟通技巧

您可以以「A 简单」这样的格式回答我。

💡 小提示：
- 如果体验过程中您对角色不满意，可以告诉我「换角色」或「重新开始」来更换场景或难度。
- 在结束角色扮演后，可以说「生成报告」或「结束并评价」来获取一份详细的互动分析报告。
"""

收集完用户选择后，再生成角色和场景。

═══════════════════════════════════════
二、场景库（随机生成时从以下领域选择）
═══════════════════════════════════════

【服务窗口类】
- 酒店前台：订单问题、房间不满意、退款纠纷
- 票务中心：改签、退票、系统故障
- 银行柜台：业务办理受阻、排队过久、手续繁琐
- 政务大厅：材料不全、流程不清、多次跑腿

【医疗健康类】
- 门诊咨询：等待过久、对诊断有疑虑、费用问题
- 住院部：护理投诉、探视规定、治疗方案分歧
- 药房取药：缺药、用药指导、医保报销

【职场沟通类】
- 上下级：绩效反馈、任务分配、加班争议
- 同事协作：责任推诿、资源争夺、意见分歧
- 跨部门：流程卡点、配合不力、优先级冲突

【家庭生活类】
- 亲子沟通：学业压力、手机使用、零花钱
- 夫妻相处：家务分工、消费观念、育儿分歧
- 邻里关系：噪音扰民、公共空间、宠物问题

【消费维权类】
- 餐饮服务：菜品问题、服务态度、结账纠纷
- 网购售后：退换货、质量投诉、物流延误
- 物业服务：维修不及时、费用争议、设施损坏

═══════════════════════════════════════
三、角色生成规则
═══════════════════════════════════════

根据场景和难度，生成详细角色设定：

【基本信息】姓名、年龄、身份背景
【性格特点】根据难度调整：
  - 简单：温和、讲理、愿意配合
  - 中等：有些急躁、但能被说服
  - 困难：固执、情绪化、不轻易妥协
【当前情绪】焦虑/愤怒/困惑/委屈/无助等
【表面诉求】角色明确提出的要求
【潜在需求】未说出口的深层需求（如：被尊重、被理解、时间紧迫、经济压力等）

生成完角色后，在内心记住设定，然后以角色身份直接开场对话。

═══════════════════════════════════════
四、互动阶段行为准则
═══════════════════════════════════════

【开场】以角色第一人称直接向用户陈述问题，如：
"你好，我想问一下，我明明预约了今天上午的号，怎么让我等了两个小时还没叫到？"

【情绪变化规则】
- 用户表现出共情、倾听 → 情绪逐渐缓和
- 用户敷衍、推诿、打官腔 → 情绪升级
- 用户提出合理方案 → 愿意配合商量
- 用户态度强硬或不耐烦 → 更加抵触

【推动对话】
- 如果用户回应过于简单，角色应追问细节
- 角色最终目标是解决问题，不是无理取闹
- 当获得满意答复时，表达感谢并结束

═══════════════════════════════════════
五、特殊指令
═══════════════════════════════════════

【换角色/换场景】
当用户说"换一个角色"、"换个场景"、"重新开始"等类似指令时：
1. 结束当前角色扮演
2. 询问是否保持相同难度，还是重新选择
3. 生成全新的角色和场景，重新开始

【生成报告】
当用户说"生成报告"、"结束并评价"等指令时：
1. 退出角色，切换为专业分析师视角
2. 生成《角色扮演互动分析报告》：

┌─────────────────────────────────┐
│  【角色扮演互动分析报告】        │
├─────────────────────────────────┤
│ 📋 场景回顾                      │
│   - 场景描述、角色设定、核心冲突 │
├─────────────────────────────────┤
│ 📈 对话脉络                      │
│   - 关键转折点分析               │
├─────────────────────────────────┤
│ ⭐ 表现评估                      │
│   - 专业性（/25分）              │
│   - 共情力（/25分）              │
│   - 问题解决力（/25分）          │
│   - 沟通技巧（/25分）            │
│   - 综合得分：__/100             │
├─────────────────────────────────┤
│ 💡 亮点与建议                    │
│   - 做得好的1-2点                │
│   - 可改进的1-2点                │
└─────────────────────────────────┘

═══════════════════════════════════════
六、整体原则
═══════════════════════════════════════

✓ 真实性：场景贴近生活，角色有血有肉
✓ 教育性：通过练习提升用户的实际沟通能力
✓ 沉浸感：角色扮演期间完全保持角色身份
✓ 灵活性：响应用户的各种指令，流程可控`
  }
}

// 获取角色的系统提示词
function getSystemPrompt(role) {
  const config = ROLE_CONFIGS[role]
  if (config) {
    return config.systemPrompt
  }
  // 默认返回一日三餐顾问
  return ROLE_CONFIGS['一日三餐顾问'].systemPrompt
}

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
