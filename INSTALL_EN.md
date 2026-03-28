# Installation Guide

## Prerequisites

- Node.js 18+ installed
- LM Studio installed and running

## Installation Steps

### 1. Globally Install MCP Package

```bash
npm install -g mcp-hydrocoder-vision
```

### 2. Configure Claude

Edit the `~/.claude.json` file in your user directory and add the following configuration:

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

### 3. Authorize Tool Permissions

Add the following configuration to `~/.claude/settings.json` to avoid manual confirmation for each tool use:

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

### 4. Start LM Studio

1. Open LM Studio
2. Download and load the `Qwen3-VL-4B-Instruct` model
3. Start the local server (default port: 1234)

### 5. Verify Installation

Paste a screenshot into the Claude Code window, type text like "recognize image", and the MCP will be automatically invoked to recognize the content.

## Troubleshooting

### Connection Failed

Ensure LM Studio is running and the local server is started. Check if the `LM_STUDIO_URL` environment variable is correct.

### No Model Response

Ensure the Qwen3-VL-4B-Instruct model is loaded in LM Studio.
