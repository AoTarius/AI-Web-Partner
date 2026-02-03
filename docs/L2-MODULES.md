# L2 - 模块设计文档

## 核心模块划分

### 1. 布局模块 (Layout)
**路径**: `/src/layouts`
**职责**: 页面布局、导航、侧边栏
**组件**:
- `MainLayout.jsx` - 主布局容器
- `Header.jsx` - 顶部导航
- `Sidebar.jsx` - 侧边栏
- `Footer.jsx` - 页脚

### 2. 页面模块 (Pages)
**路径**: `/src/pages`
**职责**: 业务页面、路由视图
**页面**:
- `Home.jsx` - 首页
- `Dashboard.jsx` - 控制台
- `NotFound.jsx` - 404 页面

### 3. 组件模块 (Components)
**路径**: `/src/components`
**职责**: 可复用 UI 组件
**分类**:
- `/ui` - **设计系统组件（核心）** (Button, Card, Input 等)
- `/common` - 业务通用组件
- `/forms` - 表单组件
- `/feedback` - 反馈组件

### 4. 设计系统模块 (Design System) ⭐
**路径**: `/src/components/ui`
**职责**: 定义所有基础 UI 组件和视觉规范
**核心组件**:
- `button.jsx` - 按钮组件
- `card.jsx` - 卡片组件
- `input.jsx` - 输入框组件
- 更多组件按需添加

**设计系统页面**:
- `/src/pages/DesignSystem.jsx` - 展示所有设计系统组件和规范

## 模块通信规范
- Props 传递数据
- Context 共享状态
- Custom Hooks 封装逻辑

## 命名约定
- 组件: PascalCase (UserCard.jsx)
- 工具: camelCase (formatDate.js)
- 常量: UPPER_SNAKE_CASE (API_URL)

## 样式规范

### 🎨 设计系统优先原则（必须遵守）

**重要：所有模块的视觉实现必须严格遵循设计系统规范。**

### 颜色使用规范

✅ **正确示例**
```jsx
// 使用设计系统调色板
<div className="bg-slate-50 text-slate-900 border-violet-200">
<Button className="bg-violet-600 hover:bg-violet-700">
```

❌ **错误示例**
```jsx
// 禁止使用任意颜色
<div style={{ backgroundColor: '#FF5733' }}>
<div className="bg-[#1a2b3c]">
```

### 组件使用规范

✅ **正确示例**
```jsx
// 使用设计系统组件
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

<Button variant="default">点击</Button>
<Card>内容</Card>
```

❌ **错误示例**
```jsx
// 禁止自创样式组件
<button className="px-4 py-2 bg-[#3b82f6] rounded-lg">点击</button>
```

### 间距规范

✅ **正确示例**
```jsx
// 使用 TailwindCSS 标准间距
<div className="p-4 mb-6 gap-2">
```

❌ **错误示例**
```jsx
// 禁止任意值
<div className="p-[23px] mb-[47px]">
```

### 新组件开发流程

1. 检查设计系统是否已有相似组件
2. 如需新组件，先在 `/components/ui/` 创建
3. 在 `/pages/DesignSystem.jsx` 中展示
4. 在业务代码中使用

### 工具库使用

- **class-variance-authority**: 组件变体管理
- **tailwind-merge**: 类名合并（通过 cn() 函数）
- **clsx**: 条件类名
