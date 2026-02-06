# L3 - 组件实现指南

## 组件开发规范

### 设计系统组件模板 (Button 示例)
```jsx
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

// 使用 class-variance-authority 定义变体
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-violet-600 text-white hover:bg-violet-700',
        outline: 'border border-slate-200 bg-white hover:bg-slate-100',
        ghost: 'hover:bg-slate-100 hover:text-slate-900',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// 使用 forwardRef 支持 ref 转发
export const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'
```

### 业务组件模板 (Chat 模块示例)
```jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 rounded-md border px-3 py-2"
        placeholder="输入消息..."
      />
      <Button type="submit">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
```

## 动效规范 (Framer Motion)

### 页面过渡
```jsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}
```

### 列表动画
```jsx
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}
```

## 图标使用规范

### Lucide React (系统图标)
```jsx
import { Menu, X, ChevronDown } from 'lucide-react'

<Menu className="w-5 h-5" />
```

### React Icons (社媒图标)
```jsx
import { SiGithub, SiTwitter } from 'react-icons/si'

<SiGithub className="w-5 h-5" />
```

## Hooks 开发规范

### 自定义 Hook 模板
```jsx
import { useState, useEffect } from 'react'

export function useCustomHook(initialValue) {
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    // 副作用逻辑
  }, [])

  return [state, setState]
}
```

## 工具函数规范

### cn() - 类名合并工具
```jsx
// /src/lib/utils.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// 使用示例
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class', className)} />
```

### API 调用封装
```jsx
// /src/lib/api.js
const API_BASE = '/api'

export async function getConversations() {
  const response = await fetch(`${API_BASE}/conversations`)
  if (!response.ok) throw new Error('获取对话列表失败')
  return response.json()
}

// SSE 流式调用
export async function sendChatMessageStream(conversationId, message, role, onChunk) {
  const response = await fetch(`${API_BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, message, role }),
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullContent = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') return fullContent

        const parsed = JSON.parse(data)
        if (parsed.content) {
          fullContent += parsed.content
          onChunk(fullContent) // 实时回调
        }
      }
    }
  }
  return fullContent
}
```

## React Hooks 使用规范

### useState - 组件状态管理
```jsx
const [messages, setMessages] = useState([])
const [isLoading, setIsLoading] = useState(false)
```

### useEffect - 副作用处理
```jsx
// 组件挂载时初始化数据
useEffect(() => {
  const initData = async () => {
    const data = await fetchData()
    setData(data)
  }
  initData()
}, [])

// 依赖项变化时触发
useEffect(() => {
  // 当 conversationId 变化时加载消息
  loadMessages(conversationId)
}, [conversationId])
```

### useRef - 持久化引用
```jsx
// 防止重复初始化
const initialized = useRef(false)

useEffect(() => {
  if (initialized.current) return
  initialized.current = true
  // 初始化逻辑
}, [])

// 访问 DOM 元素
const inputRef = useRef(null)
<input ref={inputRef} />
```

## Markdown 渲染

### react-markdown 集成
```jsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  className="prose dark:prose-invert"
>
  {message.content}
</ReactMarkdown>
```

## 性能优化
- 使用 React.memo 包裹纯组件（避免不必要的重渲染）
- useMemo 缓存计算结果
- useCallback 缓存函数引用
- 懒加载: React.lazy + Suspense（路由级别代码分割）
- SSE 流式渲染（提升首字节时间，改善用户体验）

## 后端组件实现规范

### Express 路由定义
```js
// server/index.js
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// RESTful API 示例
app.get('/api/conversations', (req, res) => {
  const conversations = conversationQueries.getAll.all()
  res.json(conversations)
})

app.post('/api/conversations', (req, res) => {
  const { title } = req.body
  const result = conversationQueries.create.run(title)
  res.json({ id: result.lastInsertRowid })
})
```

### SQLite 数据库操作
```js
// server/database.js
import Database from 'better-sqlite3'

const db = new Database('./server/db/chat.db')

// 准备语句（性能优化）
export const conversationQueries = {
  getAll: db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC'),
  getById: db.prepare('SELECT * FROM conversations WHERE id = ?'),
  create: db.prepare('INSERT INTO conversations (title) VALUES (?)'),
  delete: db.prepare('DELETE FROM conversations WHERE id = ?'),
}

export const messageQueries = {
  getByConversation: db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'),
  create: db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)'),
}
```

### SSE 流式响应
```js
// server/index.js - 流式聊天 API
app.post('/api/chat/stream', async (req, res) => {
  const { conversationId, message, role } = req.body

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // 获取历史消息
  const history = messageQueries.getByConversation.all(conversationId)
  const systemPrompt = getSystemPrompt(role)

  // 调用 DeepSeek API
  const response = await fetch(`${process.env.DEEPSEEK_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ],
      stream: true
    })
  })

  // 转发流式数据
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
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`)
          }
        }
      }
    }
  }

  res.end()
})
```

### AI 角色配置
```js
// server/roles.js
export const ROLE_CONFIGS = {
  '通用大模型': {
    systemPrompt: `你是一个有帮助的、无害的、诚实的AI助手...`
  },
  '一日三餐顾问': {
    systemPrompt: `你是一位经验丰富的家常菜厨师达人...`
  },
  '角色扮演模型': {
    systemPrompt: `你是一个专业的角色扮演训练系统...`
  }
}

export function getSystemPrompt(role) {
  return ROLE_CONFIGS[role]?.systemPrompt || ROLE_CONFIGS['通用大模型'].systemPrompt
}
```

## 环境变量管理
```bash
# .env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxx
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
```

```js
// 使用 dotenv 加载
import dotenv from 'dotenv'
dotenv.config()

const apiKey = process.env.DEEPSEEK_API_KEY
```
