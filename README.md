# AI Web Partner Training

基于 Vite + React + TailwindCSS v4 构建的 AI 对话平台，集成 DeepSeek API，提供多角色 AI 对话功能。

## ✨ 核心特性

- 🤖 **多角色 AI 对话** - 一日三餐顾问、角色扮演模型、通用大模型
- 💬 **流式响应** - SSE 实时流式输出，打字机效果
- 💾 **持久化存储** - SQLite 本地数据库，对话永久保存
- 🎨 **设计系统驱动** - shadcn/ui 风格，统一视觉规范
- ⚡ **极速开发** - Vite + HMR，毫秒级热更新
- 📱 **响应式设计** - 完美适配桌面和移动端

## 技术栈

### 前端技术
- **Vite** 5.x - 极速构建工具
- **React** 18.3 - UI 框架
- **React Router** 7.x - 路由管理
- **TailwindCSS** v4 - 原子化 CSS
- **Framer Motion** - 动效库
- **Lucide React** - 系统图标
- **React Icons** - 社媒图标
- **class-variance-authority** - 组件变体管理
- **tailwind-merge** - 类名合并工具
- **react-markdown** - Markdown 渲染

### 后端技术
- **Node.js** (ES Module) - 运行环境
- **Express** 4.x - Web 框架
- **better-sqlite3** - SQLite 数据库
- **DeepSeek API** - AI 对话服务
- **CORS** - 跨域支持
- **dotenv** - 环境变量管理
- **concurrently** - 并发进程管理

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
创建 `.env` 文件（项目根目录）：
```bash
DEEPSEEK_API_KEY=sk-你的API密钥
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
```

> 💡 获取 API Key: 访问 [DeepSeek 官网](https://platform.deepseek.com/) 注册并获取密钥

### 3. 启动项目
```bash
# 一键启动前后端（推荐）
npm run dev

# 或分别启动
npm run dev:client  # 前端 (http://localhost:5173)
npm run dev:server  # 后端 (http://localhost:3001)
```

### 4. 访问应用
- **首页**: http://localhost:5173
- **AI 对话**: http://localhost:5173/chat
- **设计系统**: http://localhost:5173/design-system

### 5. 生产构建
```bash
npm run build    # 构建前端
npm run preview  # 预览生产版本
```

**构建输出示例：**
```
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-[hash].css     13.56 kB │ gzip:  3.41 kB
dist/assets/index-[hash].js     272.77 kB │ gzip: 88.83 kB
```
- 首屏加载优化，gzip 压缩后约 92 KB
- 包含 React + Router + TailwindCSS + Framer Motion 完整技术栈


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


### 调色板

**Slate** (主色调 - 用于文本、背景、边框)
- `slate-50` - 最浅背景
- `slate-100/200` - 浅背景、禁用状态
- `slate-500` - 次要文本
- `slate-900` - 主要文本

**Violet** (强调色 - 用于主要操作、链接)
- `violet-50` - 浅背景高亮
- `violet-100/200` - Hover 状态
- `violet-500/600` - 主按钮、主要操作
- `violet-700` - 按钮按下态

**Fuchsia** (点缀色 - 用于渐变、特殊强调)
- `fuchsia-500/600` - 渐变端点
- 与 Violet 搭配使用：`from-violet-600 to-fuchsia-600`

### 排版规范

| 元素 | 类名 | 用途 |
|------|------|------|
| H1 | `text-4xl font-bold` | 页面主标题 |
| H2 | `text-3xl font-bold` | 章节标题 |
| H3 | `text-2xl font-semibold` | 小节标题 |
| Body | `text-base` | 正文 |
| Small | `text-sm` | 辅助文本 |

### UI 组件库

#### Button 组件
**变体 (variant)：**
- `default` - 主按钮（violet 背景）
- `outline` - 次要按钮（白底边框）
- `ghost` - 透明按钮
- `destructive` - 危险操作（红色）
- `secondary` - 次要操作（灰色）
- `link` - 链接样式

**尺寸 (size)：**
- `sm` - 小按钮 (h-9)
- `default` - 标准按钮 (h-10)
- `lg` - 大按钮 (h-11)
- `icon` - 图标按钮

**使用示例：**
```jsx
<Button variant="default" size="lg">主要操作</Button>
<Button variant="outline">次要操作</Button>
```

#### Card 组件
**子组件：**
- `Card` - 卡片容器
- `CardHeader` - 头部区域
- `CardTitle` - 标题文本
- `CardDescription` - 描述文本
- `CardContent` - 内容区域
- `CardFooter` - 底部区域

**使用示例：**
```jsx
<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    卡片内容
  </CardContent>
  <CardFooter>
    <Button>操作</Button>
  </CardFooter>
</Card>
```

### 可扩展组件建议

按需添加以下组件（位于 `/src/components/ui/`）：
- **Input** - 输入框（文本、密码、搜索）
- **Select** - 下拉选择器
- **Checkbox** - 复选框
- **Radio** - 单选框
- **Switch** - 开关
- **Dialog** - 对话框/模态框
- **Tabs** - 标签页
- **Accordion** - 手风琴折叠面板
- **Toast** - 消息提示
- **Dropdown** - 下拉菜单

> 添加新组件后，在 `/src/pages/DesignSystem.jsx` 中添加展示和文档
## 分型文档结构

项目采用三层分型架构：

- **L1-PROJECT.md** - 系统级架构、全局配置、核心理念、设计系统约束
- **L2-MODULES.md** - 模块级功能、页面布局、业务逻辑、样式规范
- **L3-COMPONENTS.md** - 组件级实现、工具函数、细节处理

详见 `/docs` 目录。

## 项目架构

### 前端目录结构
```
/src
  /components
    /ui          # 设计系统组件（核心）
      button.jsx
      card.jsx
    /chat        # AI 对话模块
      ChatSidebar.jsx       # 对话列表侧边栏
      ChatHeader.jsx        # 对话区顶部
      MessageList.jsx       # 消息展示
      ChatInput.jsx         # 消息输入
      TypingIndicator.jsx   # 加载动画
      ScrollToBottomButton.jsx
    Header.jsx   # 顶部导航
    Hero.jsx     # 首页 Hero
    Footer.jsx   # 页脚
  /pages
    Home.jsx           # 首页
    ChatPage.jsx       # AI 对话页（全屏布局）
    DesignSystem.jsx   # 设计系统展示页
  /layouts
    MainLayout.jsx     # 主布局（Header + Outlet + Footer）
  /lib
    api.js       # API 调用封装
    utils.js     # cn() 工具函数
  /assets        # 静态资源
```

### 后端目录结构
```
/server
  index.js       # Express 服务器入口
  database.js    # SQLite 数据库操作
  roles.js       # AI 角色配置（系统提示词）
  seed.js        # 数据库初始化脚本
  reset-db.js    # 数据库重置脚本
  /db            # SQLite 数据库文件
    chat.db      # 对话数据（自动创建）
```

### 数据库设计
**表结构：**
```sql
-- 对话表
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 消息表
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  role TEXT NOT NULL,  -- 'user' 或 'assistant'
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);
```

## 路由

- `/` - 首页（Hero 展示 + 特性介绍）
- `/chat` - AI 对话页（全屏独立布局）
- `/design-system` - 设计系统展示页

## API 接口

### 对话管理
- `GET /api/conversations` - 获取所有对话
- `POST /api/conversations` - 创建新对话
- `PATCH /api/conversations/:id` - 更新对话标题
- `DELETE /api/conversations/:id` - 删除对话

### 消息管理
- `GET /api/conversations/:id/messages` - 获取对话消息
- `POST /api/conversations/:id/messages` - 创建消息

### AI 聊天
- `POST /api/chat` - 发送聊天消息（非流式）
- `POST /api/chat/stream` - 发送聊天消息（SSE 流式）
- `POST /api/chat/title` - 生成对话标题

## AI 角色系统

项目内置三种 AI 角色，每种角色有独特的系统提示词和行为模式：

### 1️⃣ 通用大模型
- **定位**: 全能助手
- **能力**: 知识问答、文本处理、编程辅助、创意写作等
- **特点**: 有帮助、无害、诚实

### 2️⃣ 一日三餐顾问
- **定位**: 家常菜厨师达人
- **能力**: 菜谱定制、烹饪指导、食材替代建议
- **特点**: 详细到零基础可操作，考虑时间和预算

### 3️⃣ 角色扮演模型
- **定位**: 沟通训练系统
- **能力**: 模拟真实场景（医患、客服、职场等），提供互动分析报告
- **特点**: 沉浸式体验，帮助提升沟通技巧

> 角色配置位于 `server/roles.js`，可自定义添加更多角色

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
import { sendChatMessageStream } from '@/lib/api'
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

## 常见问题

### Q: 如何添加新的 AI 角色？
A: 编辑 `server/roles.js`，在 `ROLE_CONFIGS` 中添加新角色配置，包含名称和 systemPrompt。

### Q: 数据库在哪里？
A: `/server/db/chat.db`，第一次运行时自动创建。

### Q: 如何重置数据库？
A: 运行 `node server/reset-db.js` 或直接删除 `/server/db/chat.db` 文件后重启服务器。

### Q: 端口冲突怎么办？
A: 修改 `server/index.js` 中的 `PORT = 3001` 和 `vite.config.js` 中的代理配置。

### Q: 如何查看 API 请求日志？
A: 后端控制台会实时显示所有 API 请求和 DeepSeek API 调用信息。

### Q: 支持哪些 Markdown 语法？
A: 支持 GitHub Flavored Markdown (GFM)，包括表格、代码块、任务列表等。

## 下一步功能建议

- [ ] **用户认证系统** - 支持多用户、独立对话空间
- [ ] **对话搜索** - 全文搜索历史消息
- [ ] **导出功能** - 导出对话为 Markdown/PDF
- [ ] **消息分页** - 长对话加载优化
- [ ] **主题切换** - 深色/浅色模式
- [ ] **语音输入** - Web Speech API 集成
- [ ] **多模态支持** - 图片上传和识别
- [ ] **对话分享** - 生成分享链接

## 技术优势

### 为什么选择 Node.js 后端？
✅ **同一技术栈** - 前后端都用 JavaScript，学习成本低
✅ **统一管理** - npm 管理所有依赖，一个项目搞定
✅ **开发简单** - 一个命令启动前后端
✅ **性能优秀** - better-sqlite3 是同步 API，速度极快

### 为什么选择 SQLite？
✅ **零配置** - 无需安装数据库服务器
✅ **轻量级** - 单个文件，易于备份和迁移
✅ **高性能** - 本地数据库，毫秒级响应
✅ **可靠性** - 生产级数据库，被广泛使用

## Node.js 要求

- 推荐 Node.js 18+ (当前使用 v18.19.1)
- Vite 最新版需要 Node.js 20+

### 环境兼容性
- **当前配置**: Node.js 18.19.1 + Vite 5.4.10
- **推荐升级**: Node.js 20.19+ 或 22.12+ 以支持最新 Vite 版本
- **安全提示**: 定期运行 `npm audit` 检查依赖漏洞

## License

MIT

