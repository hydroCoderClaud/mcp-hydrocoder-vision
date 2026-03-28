# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # Install dependencies
npm run build    # Build TypeScript to dist/ (optional, for production)
npm run dev      # Run in watch mode
npm start        # Start the server using tsx (development)
```

## Architecture

This is an MCP (Model Context Protocol) server that enables image analysis using Qwen3 VL 4B running locally via LM Studio.

**Key components:**
- `src/index.ts` - Main server entry point using `@modelcontextprotocol/sdk`
- Three tools exposed: `analyzeImage`, `extractText`, `describeForCode`
- All image processing converts to base64 and sends to LM Studio's OpenAI-compatible API
- Input validation via Zod schemas
- Uses `tsx` for running TypeScript directly (no build required for development)

**Environment variables:**
- `LM_STUDIO_URL` - LM Studio API endpoint (default: http://localhost:1234/v1/chat/completions)
- `VISION_MODEL` - Model name (default: Qwen3-VL-4B-Instruct)

## Configuration

To use with Claude Code (global installation via npm), add to `~/.claude/settings.json`:

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

## Requirements

- LM Studio must be running with Qwen3 VL 4B model loaded
- Node.js 18+
- TypeScript 5+ for development
