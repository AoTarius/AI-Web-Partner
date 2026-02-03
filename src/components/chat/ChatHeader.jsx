import { motion } from 'framer-motion'
import { Menu, ChevronDown, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function ChatHeader({ currentModel, onModelChange, isSidebarOpen, onToggleSidebar }) {
  return (
    <div className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 左侧：侧边栏切换按钮 */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* 模型选择器 */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="px-4 py-2 border-slate-200 dark:border-slate-800 cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {currentModel}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
