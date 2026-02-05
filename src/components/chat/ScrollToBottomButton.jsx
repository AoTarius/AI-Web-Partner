import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ScrollToBottomButton({ visible, onClick }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        >
          <Button
            onClick={onClick}
            size="sm"
            className="rounded-full shadow-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 gap-1 px-4"
          >
            <ChevronDown className="h-4 w-4" />
            滚动到底部
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
