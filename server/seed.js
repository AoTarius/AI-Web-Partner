import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据库路径
const dbPath = path.join(__dirname, 'db', 'chat.db')

// 确保数据库目录存在
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// 如果数据库文件存在，尝试删除（避免损坏的数据库）
if (fs.existsSync(dbPath)) {
  console.log('🗑️  删除旧数据库文件...')
  try {
    fs.unlinkSync(dbPath)
    console.log('✅ 旧数据库已删除')
  } catch (err) {
    console.warn('⚠️  无法删除旧数据库，将尝试重建表结构')
    console.warn('   如果继续报错，请手动删除:', dbPath)
  }
}

// 创建数据库连接
const db = new Database(dbPath)

// 初始化数据库表结构
console.log('📋 初始化数据库表...')
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  )
`)

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages(conversation_id)
`)

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_conversations_updated
  ON conversations(updated_at DESC)
`)

console.log('✅ 数据库表初始化完成')

// 对话标题模板
const conversationTitles = [
  'React Hooks 最佳实践',
  'TypeScript 类型推断详解',
  'Vite 构建优化技巧',
  'TailwindCSS 响应式设计',
  'JavaScript 异步编程',
  'Node.js 性能调优',
  'Docker 容器化部署',
  'Git 分支管理策略',
  'REST API 设计规范',
  'GraphQL 查询优化',
  'MongoDB 索引设计',
  'Redis 缓存策略',
  'Nginx 反向代理配置',
  'WebSocket 实时通信',
  'JWT 认证实现',
  'OAuth2.0 授权流程',
  'CSS Grid 布局技巧',
  'Webpack 模块打包',
  'ESLint 代码规范',
  'Jest 单元测试',
  'Cypress E2E 测试',
  'CI/CD 流水线搭建',
  'Linux 常用命令',
  'MySQL 查询优化',
  'Python 爬虫开发',
  'Django REST Framework',
  'Vue3 Composition API',
  'Next.js SSR 原理',
  'AWS 云服务部署',
  '算法与数据结构',
]

// 用户问题模板
const userQuestions = [
  '你能帮我解释一下这个概念吗？',
  '这个问题的最佳实践是什么？',
  '我遇到了一个错误，该如何解决？',
  '能给我一个实际的代码示例吗？',
  '这个和那个有什么区别？',
  '在生产环境中应该注意什么？',
  '性能优化有哪些建议？',
  '有推荐的学习资源吗？',
  '常见的坑有哪些？',
  '如何进行单元测试？',
  '部署流程是怎样的？',
  '安全性方面需要注意什么？',
  '和其他方案相比有什么优势？',
  '能否详细说明实现原理？',
  '有没有现成的轮子可以用？',
]

// AI 回答模板
const assistantResponses = [
  '这是一个很好的问题。让我详细解释一下...',
  '根据我的理解，最佳实践应该是...',
  '这个错误通常是由以下几个原因造成的...',
  '当然可以，这里有一个简单的示例代码...',
  '它们的主要区别在于以下几个方面...',
  '在生产环境中，你需要特别注意...',
  '关于性能优化，我建议从以下几个方面入手...',
  '我推荐以下一些优质的学习资源...',
  '确实有一些常见的陷阱需要注意...',
  '单元测试可以按照以下步骤进行...',
  '部署流程一般包括以下几个步骤...',
  '安全性是非常重要的，建议考虑...',
  '相比其他方案，这个的优势主要体现在...',
  '实现原理可以分为几个核心部分...',
  '是的，有一些成熟的库可以使用...',
]

// 生成随机时间戳（最近30天内）
function randomDate() {
  const now = Date.now()
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  const randomTime = thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo)
  return new Date(randomTime).toISOString()
}

// 清空数据库
function clearDatabase() {
  console.log('🗑️  清空现有数据...')
  db.prepare('DELETE FROM messages').run()
  db.prepare('DELETE FROM conversations').run()
  console.log('✅ 数据已清空\n')
}

// 生成测试数据
function seedDatabase() {
  console.log('🌱 开始生成测试数据...\n')

  // 清空旧数据
  clearDatabase()

  let totalMessages = 0

  // Prepared statements
  const insertConv = db.prepare('INSERT INTO conversations (title, created_at, updated_at) VALUES (?, ?, ?)')
  const insertMsg = db.prepare('INSERT INTO messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, ?)')

  // 使用事务批量插入
  const insertMany = db.transaction(() => {
    // 生成 30 个对话
    for (let i = 0; i < 30; i++) {
    const title = conversationTitles[i]
    const convTimestamp = randomDate()

    // 创建对话
    const result = insertConv.run(title, convTimestamp, convTimestamp)
    const conversationId = result.lastInsertRowid

    // 随机生成 3-10 条消息
    const messageCount = Math.floor(Math.random() * 8) + 3

    for (let j = 0; j < messageCount; j++) {
      const msgTimestamp = new Date(new Date(convTimestamp).getTime() + j * 60000).toISOString()

      // 用户提问
      const userQuestion = userQuestions[Math.floor(Math.random() * userQuestions.length)]
      insertMsg.run(conversationId, 'user', userQuestion, msgTimestamp)
      totalMessages++

      // AI 回答
      const aiResponse = assistantResponses[Math.floor(Math.random() * assistantResponses.length)]
      insertMsg.run(conversationId, 'assistant', aiResponse, new Date(new Date(msgTimestamp).getTime() + 10000).toISOString())
      totalMessages++
    }

      console.log(`✅ [${i + 1}/30] 创建对话: "${title}" (${messageCount * 2} 条消息)`)
    }
  })

  // 执行事务
  insertMany()

  console.log(`\n🎉 测试数据生成完成！`)
  console.log(`📊 总计: 30 个对话, ${totalMessages} 条消息`)
}

// 执行数据填充
try {
  seedDatabase()
  db.close()
  console.log('\n✨ 数据库已准备就绪，可以开始测试了！')
  process.exit(0)
} catch (error) {
  console.error('❌ 生成测试数据失败:', error)
  db.close()
  process.exit(1)
}
