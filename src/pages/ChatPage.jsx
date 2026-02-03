import { useState } from 'react'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'

export function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '你好！我是AI助手，有什么可以帮助你的吗？',
      timestamp: new Date().toISOString(),
    },
  ])
  const [currentModel, setCurrentModel] = useState('Claude Sonnet 4.5')

  const handleSendMessage = (content) => {
    const newMessage = {
      id: messages.length + 1,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, newMessage])

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: 'assistant',
        content: '这是一个模拟的AI回复。实际项目中，这里会调用AI API。',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* 侧边栏 - 始终渲染，通过宽度控制显示 */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
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
        <MessageList messages={messages} />

        {/* 输入区域 */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
