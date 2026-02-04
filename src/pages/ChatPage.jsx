import { useState, useEffect, useRef } from 'react'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import {
  createConversation,
  createMessage,
  getMessages,
  getConversations,
  sendChatMessageStream,
} from '@/lib/api'

export function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [currentModel, setCurrentModel] = useState('DeepSeek v1')
  const [isLoading, setIsLoading] = useState(false)
  const initialized = useRef(false)

  // 创建新对话
  const handleNewConversation = async () => {
    try {
      const conversation = await createConversation('新对话')
      setCurrentConversationId(conversation.id)
      setMessages([])
    } catch (error) {
      console.error('创建对话失败:', error)
    }
  }

  // 切换对话
  const handleSelectConversation = async (conversationId) => {
    try {
      setIsLoading(true)
      setCurrentConversationId(conversationId)
      const msgs = await getMessages(conversationId)
      setMessages(msgs)
    } catch (error) {
      console.error('加载消息失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 发送消息
  const handleSendMessage = async (content) => {
    // 如果没有当前对话，先创建一个
    let conversationId = currentConversationId
    if (!conversationId) {
      const conversation = await createConversation('新对话')
      conversationId = conversation.id
      setCurrentConversationId(conversationId)
    }

    try {
      setIsLoading(true)

      // 创建用户消息
      const userMessage = await createMessage(conversationId, 'user', content)
      setMessages((prev) => [...prev, userMessage])

      // 创建一个临时的 AI 消息占位符
      const tempAiMessage = {
        id: 'streaming',
        conversation_id: conversationId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, tempAiMessage])

      // 流式获取 AI 回复
      const finalContent = await sendChatMessageStream(
        conversationId,
        content,
        (partialContent) => {
          // 实时更新消息内容
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === 'streaming'
                ? { ...msg, content: partialContent }
                : msg
            )
          )
        }
      )

      // 保存完整的 AI 回复到数据库
      const savedAiMessage = await createMessage(
        conversationId,
        'assistant',
        finalContent
      )

      // 用数据库返回的消息替换临时消息
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === 'streaming' ? savedAiMessage : msg
        )
      )
    } catch (error) {
      console.error('发送消息失败:', error)
      // 移除临时消息
      setMessages((prev) => prev.filter((msg) => msg.id !== 'streaming'))
      alert('发送消息失败，请检查 API 配置')
    } finally {
      setIsLoading(false)
    }
  }

  // 初始化：加载现有对话或创建新对话
  useEffect(() => {
    // 防止 React 18 Strict Mode 重复执行
    if (initialized.current) return
    initialized.current = true

    const initConversation = async () => {
      try {
        const conversations = await getConversations()
        if (conversations.length > 0) {
          // 如果有对话，选择最新的
          const latestConversation = conversations[0]
          setCurrentConversationId(latestConversation.id)
          const msgs = await getMessages(latestConversation.id)
          setMessages(msgs)
        }
        // 如果没有对话，用户可以点击"新对话"按钮创建
      } catch (error) {
        console.error('初始化对话失败:', error)
      }
    }

    initConversation()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* 侧边栏 - 始终渲染，通过宽度控制显示 */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        currentConversationId={currentConversationId}
      />

      {/* 主内容区域 */}
      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
        {/* 对话区顶部 */}
        <ChatHeader
          currentModel={currentModel}
          onModelChange={setCurrentModel}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* 消息列表 */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* 输入区域 */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
