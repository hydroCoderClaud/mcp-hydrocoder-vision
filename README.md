# MCP HydroCoder Vision

A vision-language MCP server that enables Claude Code to analyze images using **Qwen3 VL 4B** model running locally via LM Studio.

## Features

- 🔍 **Image Analysis** - Describe images in detail
- 📝 **Text Extraction (OCR)** - Extract text from images in multiple languages
- 💻 **UI to Code** - Generate HTML/CSS/JS code from UI/design screenshots
- 🏠 **100% Local** - All processing happens on your machine, no cloud API needed
- ⚡ **Fast** - Qwen3 VL 4B runs efficiently on 8GB VRAM

## Prerequisites

1. **LM Studio** installed and running
2. **Qwen3 VL 4B** model loaded in LM Studio
3. **Node.js 18+**

## Installation

```bash
# Navigate to the project directory
cd C:\workspace\develop\ccExtensions\mcpHydroVision

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

### 1. Start LM Studio

1. Open LM Studio
2. Download and load `Qwen3-VL-4B-Instruct` model
3. Start the local server (default: `http://localhost:1234`)

### 2. Configure Claude Code

Add to your `~/.claude/settings.json`:

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

## Usage

### Available Tools

#### `analyzeImage`

Analyze an image and get a detailed description.

```
/analyzeImage imagePath: "C:/path/to/image.png" prompt: "What's in this image?"
```

#### `extractText`

Extract text from an image (OCR).

```
/extractText imagePath: "C:/path/to/document.png" language: "English"
```

#### `describeForCode`

Generate code from a UI/design screenshot.

```
/describeForCode imagePath: "C:/path/to/design.png" framework: "Vue"
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LM_STUDIO_URL` | `http://localhost:1234/v1/chat/completions` | LM Studio API endpoint |
| `VISION_MODEL` | `Qwen3-VL-4B-Instruct` | Model name to use |

## Development

```bash
# Run in development mode (watch mode)
npm run dev

# Build for production
npm run build

# Start the built server
npm start
```

## Troubleshooting

### "Request failed: ECONNREFUSED"

- Make sure LM Studio is running
- Check that the local server is enabled
- Verify the `LM_STUDIO_URL` is correct

### "No response from model"

- Ensure Qwen3 VL 4B model is loaded in LM Studio
- Check LM Studio logs for errors
- Try a simpler prompt first

### Image not found

- Use absolute paths
- Ensure the file exists and is accessible
- Check file permissions

## License

MIT
