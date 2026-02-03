# L3 - 组件实现指南

## 组件开发规范

### 基础组件模板
```jsx
import { motion } from 'framer-motion'
import { tv } from 'tailwind-variants'
import clsx from 'clsx'

const componentStyles = tv({
  base: 'flex items-center justify-center',
  variants: {
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-800',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
})

export function Component({ size, variant, className, children, ...props }) {
  return (
    <motion.div
      className={componentStyles({ size, variant, className })}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
```

## 动效规范 (Framer Motion)

### 页面过渡
```jsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}
```

### 列表动画
```jsx
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}
```

## 图标使用规范

### Lucide React (系统图标)
```jsx
import { Menu, X, ChevronDown } from 'lucide-react'

<Menu className="w-5 h-5" />
```

### React Icons (社媒图标)
```jsx
import { SiGithub, SiTwitter } from 'react-icons/si'

<SiGithub className="w-5 h-5" />
```

## Hooks 开发规范

### 自定义 Hook 模板
```jsx
import { useState, useEffect } from 'react'

export function useCustomHook(initialValue) {
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    // 副作用逻辑
  }, [])

  return [state, setState]
}
```

## 工具函数规范

### 类名合并
```jsx
import clsx from 'clsx'

const className = clsx(
  'base-class',
  isActive && 'active-class',
  { 'conditional': condition }
)
```

### 样式变体
```jsx
import { tv } from 'tailwind-variants'

const button = tv({
  base: 'font-medium rounded-lg',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
    },
  },
})
```

## 性能优化
- 使用 React.memo 包裹纯组件
- useMemo 缓存计算结果
- useCallback 缓存函数引用
- 懒加载: React.lazy + Suspense
