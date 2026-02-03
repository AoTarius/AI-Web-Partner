import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据库文件路径
const dbPath = path.join(__dirname, 'db', 'chat.db')

// 确保数据库目录存在
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)

// 初始化数据库表
function initDatabase() {
  // 创建对话表
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建消息表
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

  // 创建索引
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_conversation
    ON messages(conversation_id)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_conversations_updated
    ON conversations(updated_at DESC)
  `)

  console.log('✅ 数据库初始化完成')
}

// 先初始化数据库
initDatabase()

// 对话相关操作
const conversationQueries = {
  // 获取所有对话
  getAll: db.prepare(`
    SELECT id, title, created_at, updated_at
    FROM conversations
    ORDER BY updated_at DESC
  `),

  // 创建新对话
  create: db.prepare(`
    INSERT INTO conversations (title)
    VALUES (?)
  `),

  // 更新对话标题
  updateTitle: db.prepare(`
    UPDATE conversations
    SET title = ?
    WHERE id = ?
  `),

  // 更新最后活跃时间
  updateTimestamp: db.prepare(`
    UPDATE conversations
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  // 删除对话
  delete: db.prepare(`
    DELETE FROM conversations
    WHERE id = ?
  `),

  // 获取单个对话
  getById: db.prepare(`
    SELECT id, title, created_at, updated_at
    FROM conversations
    WHERE id = ?
  `),
}

// 消息相关操作
const messageQueries = {
  // 获取对话的所有消息
  getByConversation: db.prepare(`
    SELECT id, conversation_id, role, content, created_at
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `),

  // 创建消息
  create: db.prepare(`
    INSERT INTO messages (conversation_id, role, content)
    VALUES (?, ?, ?)
  `),

  // 删除消息
  delete: db.prepare(`
    DELETE FROM messages
    WHERE id = ?
  `),
}

export {
  db,
  conversationQueries,
  messageQueries,
}
