# Quick Test Script

测试 LM Studio 连接和图像分析功能。

```bash
# 测试 API 连接
curl http://localhost:1234/v1/models

# 测试图像分析（替换为你的图片路径）
curl http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen3-VL-4B-Instruct",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "Describe this image"},
        {"type": "image_url", "image_url": {"url": "file://C:/path/to/your/image.png"}}
      ]
    }]
  }'
```

## PowerShell 测试脚本

保存为 `test-vision.ps1`：

```powershell
$imagePath = "C:\path\to\your\image.png"
$base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($imagePath))
$mimeType = "image/png"

$body = @{
    model = "Qwen3-VL-4B-Instruct"
    messages = @(
        @{
            role = "user"
            content = @(
                @{ type = "text"; text = "Describe this image" },
                @{ type = "image_url"; image_url = @{ url = "data:$mimeType;base64,$base64" } }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:1234/v1/chat/completions" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
```
