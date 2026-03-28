#!/usr/bin/env tsx
/**
 * MCP HydroCoder Vision Server
 *
 * A vision-language MCP server that connects to LM Studio running Qwen3 VL 4B
 * for local image analysis and understanding.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
// LM Studio API configuration
const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1/chat/completions';
const DEFAULT_MODEL = process.env.VISION_MODEL || 'Qwen3-VL-4B-Instruct';
// Image MIME type mapping
const MIME_TYPES = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
};
/**
 * Get MIME type from file extension
 */
function getMimeType(filePath) {
    const ext = '.' + filePath.split('.').pop()?.toLowerCase();
    return MIME_TYPES[ext] || 'image/png';
}
/**
 * Read file as base64 (Node.js)
 */
async function fileToBase64(filePath) {
    const fs = await import('fs');
    const path = await import('path');
    // Handle Windows paths
    const normalizedPath = filePath.replace(/\//g, '\\');
    const absolutePath = path.isAbsolute(normalizedPath)
        ? normalizedPath
        : path.resolve(process.cwd(), normalizedPath);
    const buffer = fs.readFileSync(absolutePath);
    return buffer.toString('base64');
}
/**
 * Call LM Studio API for image analysis
 */
async function analyzeImageWithLMStudio(imageDataBase64, mimeType, prompt) {
    const http = await import('http');
    const https = await import('https');
    const { URL } = await import('url');
    return new Promise((resolve, reject) => {
        const url = new URL(LM_STUDIO_URL);
        const client = url.protocol === 'https:' ? https : http;
        const requestBody = JSON.stringify({
            model: DEFAULT_MODEL,
            messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${imageDataBase64}`
                            }
                        }
                    ]
                }],
            max_tokens: 2048,
            temperature: 0.7,
        });
        const options = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
        };
        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result.choices?.[0]?.message?.content || 'No response from model');
                }
                catch (e) {
                    reject(new Error(`Failed to parse response: ${e}`));
                }
            });
        });
        req.on('error', (e) => {
            reject(new Error(`Request failed: ${e.message}. Make sure LM Studio is running with Qwen3 VL 4B loaded.`));
        });
        req.write(requestBody);
        req.end();
    });
}
// Input schemas
const AnalyzeImageInputSchema = z.object({
    imagePath: z.string().describe('Path to the image file to analyze'),
    prompt: z.string().optional().describe('Optional analysis prompt (default: "Describe this image in detail")'),
});
const ExtractTextInputSchema = z.object({
    imagePath: z.string().describe('Path to the image file containing text'),
    language: z.string().optional().describe('Expected language of the text (optional)'),
});
const DescribeForCodeInputSchema = z.object({
    imagePath: z.string().describe('Path to the UI/design image'),
    framework: z.string().optional().describe('Target framework (e.g., "React", "Vue", "HTML/CSS")'),
});
// Create server instance
const server = new Server({
    name: 'mcp-hydrocoder-vision',
    version: '0.1.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'analyzeImage': {
                const validated = AnalyzeImageInputSchema.parse(args);
                const mimeType = getMimeType(validated.imagePath);
                const imageData = await fileToBase64(validated.imagePath);
                const prompt = validated.prompt || 'Describe this image in detail.';
                const result = await analyzeImageWithLMStudio(imageData, mimeType, prompt);
                return {
                    content: [{ type: 'text', text: result }],
                };
            }
            case 'extractText': {
                const validated = ExtractTextInputSchema.parse(args);
                const mimeType = getMimeType(validated.imagePath);
                const imageData = await fileToBase64(validated.imagePath);
                const prompt = validated.language
                    ? `Extract all text from this image. The text is in ${validated.language}.`
                    : 'Extract all text from this image (OCR).';
                const result = await analyzeImageWithLMStudio(imageData, mimeType, prompt);
                return {
                    content: [{ type: 'text', text: result }],
                };
            }
            case 'describeForCode': {
                const validated = DescribeForCodeInputSchema.parse(args);
                const mimeType = getMimeType(validated.imagePath);
                const imageData = await fileToBase64(validated.imagePath);
                const framework = validated.framework || 'HTML/CSS/JavaScript';
                const prompt = `Analyze this UI/design image and generate ${framework} code that replicates it. Focus on structure, styling, and layout.`;
                const result = await analyzeImageWithLMStudio(imageData, mimeType, prompt);
                return {
                    content: [{ type: 'text', text: result }],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Invalid input: ${error.errors.map(e => e.message).join(', ')}`);
        }
        throw error;
    }
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'analyzeImage',
                description: 'Analyze an image and return a detailed description. Uses local Qwen3 VL 4B model via LM Studio.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        imagePath: {
                            type: 'string',
                            description: 'Path to the image file to analyze',
                        },
                        prompt: {
                            type: 'string',
                            description: 'Optional analysis prompt (default: "Describe this image in detail")',
                        },
                    },
                    required: ['imagePath'],
                },
            },
            {
                name: 'extractText',
                description: 'Extract text from an image (OCR). Supports multiple languages.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        imagePath: {
                            type: 'string',
                            description: 'Path to the image file containing text',
                        },
                        language: {
                            type: 'string',
                            description: 'Expected language of the text (optional)',
                        },
                    },
                    required: ['imagePath'],
                },
            },
            {
                name: 'describeForCode',
                description: 'Analyze a UI/design image and generate corresponding code (HTML/CSS/JS, Vue, React, etc.).',
                inputSchema: {
                    type: 'object',
                    properties: {
                        imagePath: {
                            type: 'string',
                            description: 'Path to the UI/design image',
                        },
                        framework: {
                            type: 'string',
                            description: 'Target framework (e.g., "React", "Vue", "HTML/CSS")',
                        },
                    },
                    required: ['imagePath'],
                },
            },
        ],
    };
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('MCP HydroCoder Vision Server running on stdio');
    console.error(`LM Studio URL: ${LM_STUDIO_URL}`);
    console.error(`Model: ${DEFAULT_MODEL}`);
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
