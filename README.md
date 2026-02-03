# AI Partner Training

Vite + React + TailwindCSS v4 + Design System 开发平台

## 技术栈

- **Vite** 5.x - 极速构建工具
- **React** 18.3 - UI 框架
- **React Router** 7.x - 路由管理
- **TailwindCSS** v4 - 原子化 CSS
- **Design System** - shadcn/ui 风格组件
- **Framer Motion** - 动效库
- **Lucide React** - 系统图标
- **React Icons** - 社媒图标
- **class-variance-authority** - 组件变体管理
- **tailwind-merge** - 类名合并工具

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🎨 设计系统

**核心原则：一切设计必须来自设计系统**

访问 `/design-system` 路由查看完整的设计系统文档，包括：
- 调色板（Slate, Violet, Fuchsia）
- 排版规范
- 按钮组件及变体
- 卡片组件
- 更多 UI 组件...

### 设计系统约束

✅ **必须做**
- 使用 `/components/ui/` 中的组件
- 使用 TailwindCSS 预定义颜色（slate, violet, fuchsia）
- 使用标准间距系统

❌ **禁止做**
- 使用任意颜色值（如 `#FF5733` 或 `bg-[#1a2b3c]`）
- 创建未经设计系统定义的组件样式
- 使用任意间距值（如 `p-[23px]`）

## 分型文档结构

项目采用三层分型架构：

- **L1-PROJECT.md** - 系统级架构、全局配置、核心理念、设计系统约束
- **L2-MODULES.md** - 模块级功能、页面布局、业务逻辑、样式规范
- **L3-COMPONENTS.md** - 组件级实现、工具函数、细节处理

详见 `/docs` 目录。

## 目录结构

```
/src
  /components
    /ui          # 设计系统组件（核心）
      button.jsx
      card.jsx
    Header.jsx   # 顶部导航
    Hero.jsx     # 首页 Hero
    Footer.jsx   # 页脚
  /pages
    Home.jsx           # 首页
    DesignSystem.jsx   # 设计系统展示页
  /layouts
    MainLayout.jsx     # 主布局（Header + Footer）
  /lib
    utils.js           # cn() 等工具函数
  /hooks         # 自定义 Hooks
  /assets        # 静态资源
```

## 路由

- `/` - 首页（Hero 展示）
- `/design-system` - 设计系统展示页

## 开发规范

- 组件使用 PascalCase 命名
- 工具函数使用 camelCase 命名
- 常量使用 UPPER_SNAKE_CASE 命名
- **所有样式必须来自设计系统**
- 使用 Framer Motion 实现动效
- Lucide 图标用于系统 UI
- React Icons (Si 前缀) 用于社媒图标

## 路径别名

项目配置了 `@` 路径别名指向 `src` 目录：

```jsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

## 组件示例

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>示例卡片</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">点击按钮</Button>
      </CardContent>
    </Card>
  )
}
```

## Node.js 要求

- 推荐 Node.js 18+ (当前使用 v18.19.1)
- Vite 最新版需要 Node.js 20+

## License

MIT
