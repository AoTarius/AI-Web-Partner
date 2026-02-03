import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Palette, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Header() {
  const location = useLocation()
  const isDesignSystem = location.pathname === '/design-system'

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500"
          >
            <Palette className="h-6 w-6 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            AI Partner
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/">
            <Button
              variant={!isDesignSystem ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link to="/design-system">
            <Button
              variant={isDesignSystem ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
            >
              <Palette className="h-4 w-4" />
              Design System
            </Button>
          </Link>
        </nav>
      </div>
    </motion.header>
  )
}
