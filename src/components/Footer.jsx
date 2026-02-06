import { Heart, Github } from 'lucide-react'
import { SiReact, SiVite, SiTailwindcss } from 'react-icons/si'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              技术栈
            </h3>
            <div className="flex flex-col gap-3">
              <TechItem icon={<SiVite />} name="Vite" color="text-purple-600" />
              <TechItem icon={<SiReact />} name="React 18" color="text-blue-600" />
              <TechItem icon={<SiTailwindcss />} name="TailwindCSS v4" color="text-cyan-600" />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              资源
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-slate-50">
                  文档
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-slate-50">
                  组件库
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-slate-50">
                  示例
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              社区
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-slate-900 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-50 dark:hover:text-slate-50"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400 md:flex-row">
          <p>
            {currentYear} AI Web Partner Training. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using Design System
          </div>
        </div>
      </div>
    </footer>
  )
}

function TechItem({ icon, name, color }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-2xl ${color}`}>{icon}</span>
      <span className="text-sm text-slate-700 dark:text-slate-300">{name}</span>
    </div>
  )
}
