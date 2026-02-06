import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Paperclip, Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const textareaRef = useRef(null)

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() && !isGenerating) {
      const success = await onSendMessage(input.trim())
      // 只有成功发送才清空输入框
      if (success !== false) {
        setInput('')
        setIsGenerating(true)
        // 模拟生成完成
        setTimeout(() => setIsGenerating(false), 2000)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleStop = () => {
    setIsGenerating(false)
  }

  return (
    <div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* 输入框容器 */}
          <div className="relative rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-violet-600 dark:focus-within:ring-violet-950">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Shift + Enter 换行)"
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-50 dark:placeholder-slate-500"
              style={{ maxHeight: '200px' }}
            />

            {/* 底部工具栏 */}
            <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 dark:border-slate-800">
              {/* 左侧工具按钮 */}
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Paperclip className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Mic className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </Button>
              </div>

              {/* 右侧：字数统计和发送按钮 */}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'text-xs',
                    input.length > 2000
                      ? 'text-red-500'
                      : 'text-slate-400 dark:text-slate-500'
                  )}
                >
                  {input.length} / 3000
                </span>

                {isGenerating ? (
                  <Button
                    type="button"
                    onClick={handleStop}
                    size="sm"
                    variant="outline"
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <Square className="h-3 w-3" />
                    停止生成
                  </Button>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!input.trim()}
                      className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50"
                    >
                      <Send className="h-3 w-3" />
                      发送
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* 提示文字 */}
          <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
            AI可能会产生错误。请核实重要信息。
          </p>
        </form>
      </div>
    </div>
  )
}
