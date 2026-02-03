import { motion } from 'framer-motion'
import { MessageSquarePlus, History, Search, Settings, Trash2, Edit3, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'
import { getConversations, deleteConversation, updateConversationTitle } from '@/lib/api'

export function ChatSidebar({ isOpen, onToggle, onNewConversation, onSelectConversation, currentConversationId }) {
  const [hoveredItemId, setHoveredItemId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const inputRef = useRef(null)

  // 获取对话列表
  const loadConversations = async () => {
    try {
      const data = await getConversations()
      setConversations(data)
    } catch (error) {
      console.error('加载对话列表失败:', error)
    }
  }

  // 删除对话
  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      await deleteConversation(id)
      await loadConversations()
    } catch (error) {
      console.error('删除对话失败:', error)
    }
  }

  // 开始编辑
  const handleStartEdit = (conv, e) => {
    e.stopPropagation()
    setEditingId(conv.id)
    setEditingTitle(conv.title)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  // 保存编辑
  const handleSaveEdit = async (id) => {
    if (!editingTitle.trim()) {
      setEditingId(null)
      return
    }
    try {
      await updateConversationTitle(id, editingTitle.trim())
      await loadConversations()
      setEditingId(null)
    } catch (error) {
      console.error('重命名对话失败:', error)
    }
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  // 处理键盘事件
  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  // 格式化时间
  const formatTime = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diff = Math.floor((now - date) / 1000) // 秒

    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    if (diff < 604800) return `${Math.floor(diff / 86400)}天前`
    return date.toLocaleDateString()
  }

  useEffect(() => {
    loadConversations()
    // 每5秒刷新一次列表
    const interval = setInterval(loadConversations, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.aside
      animate={{
        width: isOpen ? 320 : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-shrink-0 border-r border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-950"
    >
      {/* 内容容器 - 固定宽度 320px */}
      <div className="w-80 h-full flex flex-col">
        {/* 顶部操作区 */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <Button
            onClick={onNewConversation}
            variant="default"
            className="w-full gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
          >
            <MessageSquarePlus className="h-4 w-4" />
            新对话
          </Button>
        </div>

        {/* 对话历史列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
            对话历史
          </h3>
          {conversations.map((conv) => (
            <motion.div
              key={conv.id}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredItemId(conv.id)}
              onHoverEnd={() => setHoveredItemId(null)}
              className="relative"
            >
              <Card
                onClick={() => editingId !== conv.id && onSelectConversation(conv.id)}
                className={cn(
                  'p-3 transition-all border',
                  editingId !== conv.id && 'cursor-pointer',
                  currentConversationId === conv.id
                    ? 'bg-violet-50 border-violet-200 dark:bg-violet-950/20 dark:border-violet-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {editingId === conv.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          ref={inputRef}
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, conv.id)}
                          className="flex-1 text-sm font-medium bg-white dark:bg-slate-800 border border-violet-300 dark:border-violet-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSaveEdit(conv.id)
                          }}
                          className="h-6 w-6 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-950"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancelEdit()
                          }}
                          className="h-6 w-6 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                          {conv.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {formatTime(conv.updated_at)}
                        </p>
                      </>
                    )}
                  </div>
                  {hoveredItemId === conv.id && editingId !== conv.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-1"
                    >
                      <Button
                        onClick={(e) => handleStartEdit(conv, e)}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={(e) => handleDelete(conv.id, e)}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
