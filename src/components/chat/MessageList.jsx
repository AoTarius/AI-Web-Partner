import { motion } from 'framer-motion'
import { Bot, User, Copy, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TypingIndicator } from './TypingIndicator'

export const MessageList = forwardRef(function MessageList({ messages, isLoading, onScrollStateChange }, ref) {
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // 暴露 scrollToBottom 方法给父组件
  useImperativeHandle(ref, () => ({
    scrollToBottom
  }), [scrollToBottom])

  // 检测滚动位置
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    // 距离底部超过 100px 时显示按钮
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    onScrollStateChange?.(!isNearBottom)
  }, [onScrollStateChange])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 切换对话时的加载状态（消息为空且正在加载）
  if (messages.length === 0 && isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">加载对话中...</p>
        </div>
      </div>
    )
  }

  // 空对话欢迎界面
  if (messages.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{
              scale: { type: 'spring', stiffness: 200 },
              y: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            }}
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
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="absolute inset-0 overflow-y-auto px-4 py-6 space-y-6"
    >
      {messages.map((message, index) => {
        // 只对最新5条消息使用动画，历史消息直接显示
        const isRecentMessage = index >= messages.length - 5
        const animationDelay = isRecentMessage ? (index - (messages.length - 5)) * 0.1 : 0

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: isRecentMessage ? 0 : 1, y: isRecentMessage ? 20 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
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
              {message.role === 'user' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              ) : message.id === 'streaming' && !message.content ? (
                <TypingIndicator />
              ) : (
                <div className="text-sm leading-relaxed text-slate-900 dark:text-slate-50 prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-3 prose-headings:font-semibold">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </Card>

            {message.role === 'assistant' && message.id !== 'streaming' && (
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
                  {(() => {
                    const date = new Date(message.created_at)
                    const year = date.getFullYear().toString().slice(-2)
                    const month = date.getMonth() + 1
                    const day = date.getDate()
                    const hours = date.getHours()
                    const minutes = date.getMinutes().toString().padStart(2, '0')
                    const seconds = date.getSeconds().toString().padStart(2, '0')
                    return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`
                  })()}
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
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
})
