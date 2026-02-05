// API 调用封装

const API_BASE = '/api'

// ==================== 对话 API ====================

export async function getConversations() {
  const response = await fetch(`${API_BASE}/conversations`)
  if (!response.ok) throw new Error('获取对话列表失败')
  return response.json()
}

export async function createConversation(title = '新对话') {
  const response = await fetch(`${API_BASE}/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!response.ok) throw new Error('创建对话失败')
  return response.json()
}

export async function updateConversationTitle(id, title) {
  const response = await fetch(`${API_BASE}/conversations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!response.ok) throw new Error('更新对话失败')
  return response.json()
}

export async function deleteConversation(id) {
  const response = await fetch(`${API_BASE}/conversations/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('删除对话失败')
  return response.json()
}

// ==================== 消息 API ====================

export async function getMessages(conversationId) {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`)
  if (!response.ok) throw new Error('获取消息列表失败')
  return response.json()
}

export async function createMessage(conversationId, role, content) {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, content }),
  })
  if (!response.ok) throw new Error('创建消息失败')
  return response.json()
}

// ==================== AI 聊天 API ====================

export async function sendChatMessage(conversationId, message, role) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, message, role }),
  })
  if (!response.ok) throw new Error('发送聊天消息失败')
  return response.json()
}

// 生成对话标题
export async function generateTitle(message) {
  const response = await fetch(`${API_BASE}/chat/title`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!response.ok) throw new Error('生成标题失败')
  return response.json()
}

// 流式发送消息
export async function sendChatMessageStream(conversationId, message, role, onChunk) {
  const response = await fetch(`${API_BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, message, role }),
  })

  if (!response.ok) throw new Error('发送聊天消息失败')

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
        if (data === '[DONE]') {
          return fullContent
        }
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) {
            throw new Error(parsed.error)
          }
          if (parsed.content) {
            fullContent += parsed.content
            onChunk(fullContent)
          }
        } catch (e) {
          if (e.message !== 'Unexpected end of JSON input') {
            console.error('解析 SSE 数据失败:', e)
          }
        }
      }
    }
  }

  return fullContent
}
