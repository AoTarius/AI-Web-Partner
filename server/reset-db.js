import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'db', 'chat.db')

try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath)
    console.log('✅ 数据库已删除')
  } else {
    console.log('ℹ️  数据库文件不存在')
  }
} catch (error) {
  console.error('❌ 删除失败:', error.message)
  process.exit(1)
}

console.log('✨ 现在可以运行 npm run seed 重新生成数据')
