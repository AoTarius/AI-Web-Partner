import { motion } from 'framer-motion'
import { Bot, User, Copy, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useRef, useEffect } from 'react'

export function MessageList({ messages, isLoading }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"
          >
            <Bot className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            你好！有什么可以帮助你的？
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            开始新的对话，我会尽力为你提供帮助。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'flex gap-4',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </div>
          )}

          <div className={cn('flex flex-col gap-2 max-w-3xl', message.role === 'user' && 'items-end')}>
            <Card
              className={cn(
                'px-4 py-3',
                message.role === 'user'
                  ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white border-transparent'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              )}
            >
              <p className={cn(
                'text-sm leading-relaxed whitespace-pre-wrap',
                message.role === 'assistant' && 'text-slate-900 dark:text-slate-50'
              )}>
                {message.content}
              </p>
            </Card>

            {message.role === 'assistant' && (
              <div className="flex items-center gap-2 px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RotateCw className="h-3 w-3" />
                </Button>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
                  {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>

          {message.role === 'user' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
                <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </div>
            </div>
          )}
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
