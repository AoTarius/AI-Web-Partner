# 快速启动指南

## 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:5173/

## 页面导航

### 首页 (/)
- 包含 Hero 区域
- 展示项目特性
- 提供设计系统入口

### 设计系统页 (/design-system)
- 完整的设计系统文档
- 调色板展示
- 组件库展示
- 使用示例

## 设计系统使用

### 导入组件

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
```

### 使用按钮

```jsx
// 默认按钮
<Button>点击我</Button>

// 不同变体
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="destructive">危险按钮</Button>

// 不同尺寸
<Button size="sm">小按钮</Button>
<Button size="lg">大按钮</Button>
```

### 使用卡片

```jsx
<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作</Button>
  </CardFooter>
</Card>
```

## 设计约束

### ✅ 允许的颜色

```jsx
// 使用 TailwindCSS 预定义颜色
className="bg-slate-50 text-slate-900"
className="bg-violet-600 hover:bg-violet-700"
className="border-fuchsia-200"
```

### ❌ 禁止的颜色

```jsx
// 不要使用任意颜色
style={{ backgroundColor: '#FF5733' }}  // ❌
className="bg-[#1a2b3c]"                 // ❌
```

### ✅ 允许的间距

```jsx
// 使用标准间距
className="p-4 mb-6 gap-2"
className="space-y-8"
```

### ❌ 禁止的间距

```jsx
// 不要使用任意值
className="p-[23px] mb-[47px]"  // ❌
```

## 添加新组件

1. 在 `/src/components/ui/` 创建组件文件
2. 使用 `class-variance-authority` 定义变体
3. 导出组件
4. 在 `/src/pages/DesignSystem.jsx` 添加展示
5. 更新文档

## 创建新页面

1. 在 `/src/pages/` 创建页面组件
2. 在 `/src/App.jsx` 添加路由
3. 在 Header 中添加导航链接（如需要）

```jsx
// App.jsx
<Route path="new-page" element={<NewPage />} />

// Header.jsx
<Link to="/new-page">
  <Button variant="ghost">新页面</Button>
</Link>
```

## 构建生产版本

```bash
npm run build
```

生成的文件在 `dist/` 目录。

## 预览生产版本

```bash
npm run preview
```

## 文档参考

- **L1-PROJECT.md** - 系统架构和设计系统约束
- **L2-MODULES.md** - 模块设计和样式规范
- **L3-COMPONENTS.md** - 组件实现指南
- **DESIGN_SYSTEM_SETUP.md** - 设计系统集成报告

## 开发工具

### cn() 工具函数

用于合并类名：

```jsx
import { cn } from '@/lib/utils'

function MyComponent({ className }) {
  return (
    <div className={cn('base-class', className)}>
      内容
    </div>
  )
}
```

### 路径别名

使用 `@/` 导入：

```jsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Header } from '@/components/Header'
```

## 故障排查

### 样式不生效
1. 确认 `index.css` 包含 `@import "tailwindcss";`
2. 检查 `vite.config.js` 是否配置 `tailwindcss()` 插件

### 路径别名报错
1. 检查 `jsconfig.json` 配置
2. 确认 `vite.config.js` 中的 alias 配置

### 构建错误
1. 运行 `npm install` 确保依赖完整
2. 删除 `node_modules` 和 `package-lock.json` 重新安装

---

祝开发愉快！🎉
