# MCP HydroCoder Vision

基于 **Qwen3 VL 4B** 模型的本地视觉语言 MCP 服务器，让 Claude Code 能够识别和分析图像。

## 功能特性

- 🔍 **图像分析** - 详细描述图像内容
- 📝 **文字提取 (OCR)** - 支持多种语言的文字提取
- 💻 **UI 转代码** - 从 UI/设计截图生成 HTML/CSS/JS 代码
- 🏠 **100% 本地** - 所有处理在本地完成，无需云端 API
- ⚡ **快速** - Qwen3 VL 4B 在 8GB 显存上高效运行

## 前置要求

1. **LM Studio** 已安装并运行
2. **Qwen3 VL 4B** 模型已加载到 LM Studio
3. **Node.js 18+**

## 安装步骤

```bash
# 进入项目目录
cd C:\workspace\develop\ccExtensions\mcpHydroVision

# 安装依赖
npm install

# 构建项目
npm run build
```

## 配置说明

### 1. 启动 LM Studio

1. 打开 LM Studio
2. 下载并加载 `Qwen3-VL-4B-Instruct` 模型
3. 启动本地服务器（默认：`http://localhost:1234`）

### 2. 配置 Claude Code

在 `~/.claude/settings.json` 中添加：

```json
{
  "mcpServers": {
    "hydrocoder-vision": {
      "command": "node",
      "args": ["C:/workspace/develop/ccExtensions/mcpHydroVision/dist/index.js"],
      "env": {
        "LM_STUDIO_URL": "http://localhost:1234/v1/chat/completions",
        "VISION_MODEL": "Qwen3-VL-4B-Instruct"
      }
    }
  }
}
```

## 使用方法

### 可用工具

#### `analyzeImage` - 图像分析

分析图像并获取详细描述。

```
/analyzeImage imagePath: "C:/path/to/image.png" prompt: "这张图片里有什么？"
```

#### `extractText` - 文字提取

从图像中提取文字（OCR）。

```
/extractText imagePath: "C:/path/to/document.png" language: "Chinese"
```

#### `describeForCode` - UI 转代码

从 UI/设计截图生成代码。

```
/describeForCode imagePath: "C:/path/to/design.png" framework: "Vue"
```

## 环境变量

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `LM_STUDIO_URL` | `http://localhost:1234/v1/chat/completions` | LM Studio API 端点 |
| `VISION_MODEL` | `Qwen3-VL-4B-Instruct` | 使用的模型名称 |

## 开发命令

```bash
# 开发模式（监听模式）
npm run dev

# 生产构建
npm run build

# 启动服务器
npm start
```

## 常见问题

### "Request failed: ECONNREFUSED"

- 确保 LM Studio 正在运行
- 检查本地服务器已启用
- 验证 `LM_STUDIO_URL` 配置正确

### "No response from model"

- 确保 Qwen3 VL 4B 模型已在 LM Studio 中加载
- 检查 LM Studio 日志
- 先尝试简单的提示

### 图像未找到

- 使用绝对路径
- 确保文件存在且可访问
- 检查文件权限

## 技术栈

- **MCP SDK** - Model Context Protocol
- **Qwen3 VL 4B** - 视觉语言模型
- **LM Studio** - 本地模型推理
- **TypeScript** - 类型安全

## 许可证

MIT
