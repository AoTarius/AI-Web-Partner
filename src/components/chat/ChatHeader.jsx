import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, ChevronDown, Home, Utensils, Theater, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const MODEL_OPTIONS = [
  { id: 'meal-advisor', name: '一日三餐顾问', icon: Utensils },
  { id: 'roleplay', name: '角色扮演模型', icon: Theater },
]

export function ChatHeader({ currentModel, onModelChange, onToggleSidebar, hasError, onClearError }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentOption = MODEL_OPTIONS.find((opt) => opt.name === currentModel)
  const isModelSelected = currentOption !== undefined

  return (
    <div className="relative z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
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
          <div className="relative" ref={dropdownRef}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              animate={hasError ? { x: [0, -4, 4, -4, 4, 0] } : {}}
              transition={hasError ? { duration: 0.4 } : {}}
            >
              <Card
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen)
                  if (hasError) onClearError?.()
                }}
                className={cn(
                  'px-4 py-2 cursor-pointer transition-colors',
                  hasError
                    ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900'
                    : 'border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700'
                )}
              >
                <div className="flex items-center gap-2">
                  {isModelSelected ? (
                    <>
                      <currentOption.icon className="h-4 w-4 text-violet-600" />
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        {currentModel}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                        请选择模型
                      </span>
                    </>
                  )}
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isModelSelected ? 'text-slate-500' : 'text-slate-400',
                      isDropdownOpen && 'rotate-180'
                    )}
                  />
                </div>
              </Card>
            </motion.div>

            {/* 下拉菜单 */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 z-50"
                >
                  <Card className="py-1 min-w-[180px] shadow-lg border-slate-200 dark:border-slate-700">
                    {MODEL_OPTIONS.map((option) => {
                      const OptionIcon = option.icon
                      const isSelected = option.name === currentModel
                      return (
                        <div
                          key={option.id}
                          onClick={() => {
                            onModelChange(option.name)
                            setIsDropdownOpen(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <OptionIcon className={`h-4 w-4 ${isSelected ? 'text-violet-600' : 'text-slate-500'}`} />
                          <span className="text-sm font-medium">{option.name}</span>
                        </div>
                      )
                    })}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 右侧：返回主页按钮 */}
        <Link to="/">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-950"
          >
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
