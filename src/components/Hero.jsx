import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: Sparkles,
    title: 'TailwindCSS v4',
    description: '最新原子化 CSS 框架',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Zap,
    title: 'Framer Motion',
    description: '流畅的动画体验',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Layers,
    title: 'Design System',
    description: '统一的设计语言',
    color: 'from-fuchsia-500 to-pink-500',
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>

          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl md:text-7xl">
            AI Partner
            <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Training Platform
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            基于 Vite + React + TailwindCSS v4 构建的现代化开发平台，
            采用设计系统驱动的分型架构，提供一致的用户体验。
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/design-system">
              <Button size="lg" className="gap-2">
                查看设计系统
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              了解更多
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 grid gap-6 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="border-slate-200 bg-white/50 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color}`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
