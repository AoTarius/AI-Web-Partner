# DeepSeek API 配置指南

## 1. 获取 API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册并登录账号
3. 在控制台中创建 API Key
4. 复制你的 API Key

## 2. 配置环境变量

打开项目根目录的 `.env` 文件，将 `your_api_key_here` 替换为你的真实 API Key：

```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_BASE=https://api.deepseek.com
```

## 3. 启动项目

```bash
# 安装依赖（如果还没安装）
npm install

# 启动开发服务器（同时启动前端和后端）
npm run dev
```

## 4. 测试功能

1. 打开浏览器访问 `http://localhost:5173`
2. 进入聊天页面
3. 输入消息测试 AI 回复

## 系统角色配置

当前使用的角色在 `server/index.js`：

```javascript
{
  role: '',
  content: ''
}
```

可以修改这个内容来自定义 AI 的行为，例如：

```javascript
// 数学老师
{
  role: 'system',
  content: 'You are a really good math teacher who can help students solve their math problems.'
}

// 代码助手
{
  role: 'system',
  content: 'You are an expert programmer who helps with coding questions and debugging.'
}

// 英语老师
{
  role: 'system',
  content: 'You are an English teacher who helps students improve their English skills.'
}
```

## 注意事项

1. **不要提交 `.env` 文件到 Git** - 该文件已被添加到 `.gitignore`
2. **API 配额** - 注意 DeepSeek 的免费额度限制
3. **错误处理** - 如果 API 调用失败，检查：
   - API Key 是否正确
   - 网络连接是否正常
   - 是否达到 API 配额限制
4. **对话历史** - 当前会保留最近 10 条消息作为上下文（可在 `server/index.js` 第 132 行修改）

## 下一步扩展

如果需要为不同对话设置不同的系统角色，可以：

1. 在数据库的 `conversations` 表添加 `system_role` 字段
2. 在创建对话时允许用户选择角色模板
3. 在调用 API 时根据对话 ID 读取对应的系统角色
