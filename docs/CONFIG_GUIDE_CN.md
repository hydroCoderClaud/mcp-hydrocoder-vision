# 配置指南 - 如何在 Claude Code 中使用 mcpHydroVision

## 步骤 1：下载 Qwen3 VL 4B 模型

1. 打开 **LM Studio**
2. 在搜索框中输入 `Qwen3-VL-4B-Instruct`
3. 点击下载（约 2-3 GB）
4. 下载完成后，点击 **Load** 加载模型
5. 启动本地服务器（点击 **Start Server** 按钮）

## 步骤 2：测试 LM Studio API

在浏览器或终端访问：`http://localhost:1234`

或使用 curl 测试：

```bash
curl http://localhost:1234/v1/models
```

如果返回模型列表，说明 LM Studio 运行正常。

## 步骤 3：配置 Claude Code

编辑 `C:\Users\ynzys\.claude\settings.json`，在 `mcpServers` 中添加：

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

## 步骤 4：重启 Claude Code

重新启动 Claude Code，让配置生效。

## 步骤 5：验证 MCP 服务器

在 Claude Code 中输入：

```
/tools
```

如果看到以下工具，说明配置成功：
- `analyzeImage`
- `extractText`
- `describeForCode`

## 步骤 6：开始使用

```
/analyzeImage imagePath: "C:/path/to/your/image.png" prompt: "描述这张图片"
```

---

## 常见问题

### Q: LM Studio 启动失败？
A: 确保没有其他程序占用端口 1234，可以在 LM Studio 设置中更改端口。

### Q: MCP 工具不显示？
A: 重启 Claude Code，检查 settings.json 格式是否正确。

### Q: 分析结果为空或报错？
A: 检查 LM Studio 是否已加载模型，查看 LM Studio 的日志。

### Q: 可以更改模型吗？
A: 可以，修改 `VISION_MODEL` 环境变量即可，但需要确保 LM Studio 中加载了对应模型。
