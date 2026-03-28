# 安装说明

[English Version](./INSTALL_.md) | [英文 README](./README.md) | [中文 README](./README_CN.md)

## 前置要求

- Node.js 18+ 已安装
- LM Studio 已安装并运行

## 安装步骤

### 1. 全局安装 MCP 包

```bash
npm install -g mcp-hydrocoder-vision
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

### 3. 授权工具权限

在 `~/.claude/settings.json` 中添加以下配置，可避免每次使用工具时手动确认：

```json
{
  "permissions": {
    "allow": [
      "mcp__mcp-hydrocoder-vision__analyzeImage",
      "mcp__mcp-hydrocoder-vision__extractText",
      "mcp__mcp-hydrocoder-vision__describeForCode"
    ]
  }
}
```

### 4. 启动 LM Studio

1. 打开 LM Studio
2. 下载并加载 `Qwen3-VL-4B-Instruct` 模型
3. 启动本地服务器（默认端口：1234）

### 5. 验证安装

在 Claude Code 窗口中贴入一张截图，输入"识别图像"等一类的文字，会自动调用 MCP 识别内容。

## 常见问题

### 连接失败

确保 LM Studio 正在运行且本地服务器已启动。检查 `LM_STUDIO_URL` 环境变量是否正确。

### 模型未响应

确认 Qwen3-VL-4B-Instruct 模型已加载到 LM Studio。
