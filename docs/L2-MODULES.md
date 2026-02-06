# L2 - 模块设计文档

## 核心模块划分

### 1. 布局模块 (Layout)
**路径**: `/src/layouts` + `/src/components`
**职责**: 页面布局、全局导航、页脚
**组件**:
- `MainLayout.jsx` - 主布局容器（Header + Outlet + Footer）
- `Header.jsx` - 顶部导航（首页、AI对话、设计系统）
- `Footer.jsx` - 页脚（技术栈、版权信息）

**路由集成**:
- 首页和设计系统页使用 `MainLayout`
- AI 对话页（`/chat`）使用独立全屏布局

### 2. 页面模块 (Pages)
**路径**: `/src/pages`
**职责**: 业务页面、路由视图
**页面**:
- `Home.jsx` - 首页（Hero 展示 + 特性卡片）
- `ChatPage.jsx` - AI 对话页（全屏聊天界面）
- `DesignSystem.jsx` - 设计系统展示页

### 3. AI 对话模块 (Chat) ⭐
**路径**: `/src/components/chat`
**职责**: AI 对话功能的所有交互组件
**组件**:
- `ChatSidebar.jsx` - 对话列表侧边栏（新建、切换、删除对话）
- `ChatHeader.jsx` - 对话区顶部（模型选择、侧边栏切换）
- `MessageList.jsx` - 消息展示区（用户消息 + AI 回复 + Markdown 渲染）
- `ChatInput.jsx` - 消息输入框（多行输入、快捷键支持）
- `TypingIndicator.jsx` - 加载动画（AI 思考中）
- `ScrollToBottomButton.jsx` - 回到底部按钮

**状态管理**:
- 在 `ChatPage.jsx` 中统一管理状态
- 包括：对话列表、消息历史、当前模型、加载状态等

**AI 角色系统**:
- 一日三餐顾问（定制菜谱、烹饪指导）
- 角色扮演模型（沟通练习、场景模拟）
- 通用大模型（知识问答、文本处理）

### 4. 设计系统模块 (Design System) ⭐
**路径**: `/src/components/ui`
**职责**: 定义所有基础 UI 组件和视觉规范
**核心组件**:
- `button.jsx` - 按钮组件（default, outline, ghost 等变体）
- `card.jsx` - 卡片组件（Card, CardHeader, CardTitle, CardContent）

**设计系统页面**:
- `/src/pages/DesignSystem.jsx` - 展示所有设计系统组件和规范

### 5. API 模块 (API Layer)
**路径**: `/src/lib/api.js`
**职责**: 封装所有后端 API 调用
**功能**:
- **对话管理**: `getConversations`, `createConversation`, `updateConversationTitle`, `deleteConversation`
- **消息管理**: `getMessages`, `createMessage`
- **AI 聊天**: `sendChatMessage`, `sendChatMessageStream` (SSE), `generateTitle`

**后端集成**:
- 基础路径: `/api`
- 后端服务: Express (端口 3001)
- 数据库: SQLite (better-sqlite3)
- AI 服务: DeepSeek API

## 模块通信规范
- **Props 传递**: 父子组件数据传递
- **回调函数**: 子组件触发父组件更新（如 `onSendMessage`, `onSelectConversation`）
- **状态提升**: 共享状态提升到共同父组件（`ChatPage`）
- **API 调用**: 统一通过 `lib/api.js` 封装

## 命名约定
- 组件: PascalCase (`ChatSidebar.jsx`)
- 工具: camelCase (`formatDate.js`)
- 常量: UPPER_SNAKE_CASE (`API_BASE`)
- API 函数: camelCase (`sendChatMessageStream`)
- 组件文件: PascalCase + `.jsx` 扩展名

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
