# 后端 API 服务

## 技术栈
- **Node.js + Express** - Web 服务器
- **better-sqlite3** - SQLite 数据库（同步 API，性能优秀）
- **CORS** - 跨域支持

## 数据库结构

### conversations 表（对话）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| title | TEXT | 对话标题 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 最后更新时间 |

### messages 表（消息）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| conversation_id | INTEGER | 所属对话 ID |
| role | TEXT | 角色（user/assistant） |
| content | TEXT | 消息内容 |
| created_at | DATETIME | 创建时间 |

## API 接口

### 对话接口

#### 获取所有对话
```
GET /api/conversations
Response: [{ id, title, created_at, updated_at }]
```

#### 创建新对话
```
POST /api/conversations
Body: { title: "对话标题" }
Response: { id, title, created_at, updated_at }
```

#### 更新对话标题
```
PATCH /api/conversations/:id
Body: { title: "新标题" }
Response: { id, title, created_at, updated_at }
```

#### 删除对话
```
DELETE /api/conversations/:id
Response: { success: true }
```

### 消息接口

#### 获取对话的所有消息
```
GET /api/conversations/:id/messages
Response: [{ id, conversation_id, role, content, created_at }]
```

#### 创建消息
```
POST /api/conversations/:id/messages
Body: { role: "user", content: "消息内容" }
Response: { id, conversation_id, role, content, created_at }
```

## 启动方式

### 方式1：单独启动后端
```bash
node server/index.js
```

### 方式2：同时启动前后端（推荐）
```bash
npm run dev
```

服务器将在 http://localhost:3001 运行
