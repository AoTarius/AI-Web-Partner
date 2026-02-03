import { motion } from 'framer-motion'
import { Palette, Type, Layers, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DesignSystem() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <Palette className="h-8 w-8 text-violet-600" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
            Design System
          </h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          基于 TailwindCSS v4 构建的设计系统，确保整个应用的视觉一致性。
        </p>
      </motion.div>

      <div className="space-y-12">
        <ColorPalette />
        <Typography />
        <ButtonShowcase />
        <CardShowcase />
      </div>
    </div>
  )
}

function ColorPalette() {
  const colors = [
    { name: 'Slate', shades: ['50', '100', '200', '500', '900'], base: 'slate' },
    { name: 'Violet', shades: ['50', '100', '200', '500', '900'], base: 'violet' },
    { name: 'Fuchsia', shades: ['50', '100', '200', '500', '900'], base: 'fuchsia' },
  ]

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Palette className="h-6 w-6 text-violet-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">调色板</h2>
      </div>
      <div className="space-y-6">
        {colors.map((color) => (
          <div key={color.name}>
            <h3 className="mb-3 text-lg font-semibold text-slate-700 dark:text-slate-300">
              {color.name}
            </h3>
            <div className="flex gap-2">
              {color.shades.map((shade) => (
                <motion.div
                  key={shade}
                  whileHover={{ scale: 1.1 }}
                  className={`flex h-20 w-20 flex-col items-center justify-center rounded-lg bg-${color.base}-${shade} text-xs font-medium shadow-md`}
                >
                  <span className={shade === '900' ? 'text-white' : 'text-slate-900'}>
                    {shade}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Typography() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Type className="h-6 w-6 text-violet-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">排版</h2>
      </div>
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
            Heading 1
          </h1>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Heading 2
          </h2>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Heading 3
          </h3>
        </div>
        <div>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Body text - 这是正文文本的示例。采用清晰易读的字体，确保良好的阅读体验。
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Small text - 这是小号文本，用于辅助说明和次要信息。
          </p>
        </div>
      </div>
    </section>
  )
}

function ButtonShowcase() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-violet-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">按钮</h2>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            变体
          </h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            尺寸
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function CardShowcase() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Layers className="h-6 w-6 text-violet-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">卡片</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>基础卡片</CardTitle>
            <CardDescription>简单的卡片组件示例</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              卡片内容区域，可以放置任何内容。
            </p>
          </CardContent>
        </Card>

        <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:border-violet-800 dark:from-violet-950 dark:to-fuchsia-950">
          <CardHeader>
            <CardTitle>渐变卡片</CardTitle>
            <CardDescription>使用渐变背景的卡片</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              通过自定义类名实现个性化设计。
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-300 shadow-lg">
          <CardHeader>
            <CardTitle>阴影卡片</CardTitle>
            <CardDescription>带有增强阴影效果</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              使用阴影增强卡片的层次感。
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
