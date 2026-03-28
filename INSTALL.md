# 安装说明

## 前置要求

- Node.js 18+ 已安装
- LM Studio 已安装并运行

## 安装步骤

### 1. 安装 MCP 包

全局安装：

```bash
npm install -g mcp-hydrocoder-vision
```

或者使用 npx（无需全局安装）：

```bash
npx -y mcp-hydrocoder-vision
```

### 2. 配置 Claude

编辑用户目录下的 `~/.claude.json` 文件，添加以下配置：

```json
{
  "mcpServers": {
    "hydrocoder-vision": {
      "command": "npx",
      "args": ["-y", "mcp-hydrocoder-vision"],
      "env": {
        "LM_STUDIO_URL": "http://localhost:1234/v1/chat/completions",
        "VISION_MODEL": "Qwen3-VL-4B-Instruct"
      }
    }
  }
}
```

### 3. 启动 LM Studio

1. 打开 LM Studio
2. 下载并加载 `Qwen3-VL-4B-Instruct` 模型
3. 启动本地服务器（默认端口：1234）

### 4. 验证安装

在 Claude 中输入 `/image`，应能看到 `analyzeImage`、`extractText`、`describeForCode` 等工具可用。

## 常见问题

### 连接失败

确保 LM Studio 正在运行且本地服务器已启动。检查 `LM_STUDIO_URL` 环境变量是否正确。

### 模型未响应

确认 Qwen3-VL-4B-Instruct 模型已加载到 LM Studio。
