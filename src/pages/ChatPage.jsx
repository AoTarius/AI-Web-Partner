import { useState, useEffect, useRef } from 'react'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import { createConversation, createMessage, getMessages, getConversations } from '@/lib/api'

export function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [currentModel, setCurrentModel] = useState('Claude Sonnet 4.5')
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
      // 创建用户消息
      const userMessage = await createMessage(conversationId, 'user', content)
      setMessages((prev) => [...prev, userMessage])

      // 模拟AI回复（实际项目中这里会调用 AI API）
      setTimeout(async () => {
        const aiResponse = await createMessage(
          conversationId,
          'assistant',
          '这是一个模拟的AI回复。实际项目中，这里会调用 AI API。'
        )
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    } catch (error) {
      console.error('发送消息失败:', error)
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
