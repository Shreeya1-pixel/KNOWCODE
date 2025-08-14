import { APIKeyManager, APIKeyConfig } from './APIKeyManager';
import * as vscode from 'vscode';

export interface ModelResponse {
    success: boolean;
    content: string;
    error?: string;
}

export class CloudAIService {
    private static instance: CloudAIService;
    private apiKeyManager: APIKeyManager;

    private constructor(apiKeyManager: APIKeyManager) {
        this.apiKeyManager = apiKeyManager;
    }

    public static getInstance(apiKeyManager: APIKeyManager): CloudAIService {
        if (!CloudAIService.instance) {
            CloudAIService.instance = new CloudAIService(apiKeyManager);
        }
        return CloudAIService.instance;
    }

    /**
     * Generate explanation using the best available AI provider
     */
    public async generateExplanation(
        code: string,
        context: string,
        mode: string = 'default'
    ): Promise<ModelResponse> {
        const bestKey = this.apiKeyManager.getBestAPIKey();
        
        if (!bestKey) {
            return {
                success: false,
                content: '',
                error: 'No API keys configured. Please configure API keys or use local Ollama model.'
            };
        }

        try {
            switch (bestKey.provider) {
                case 'openai':
                    return await this.callOpenAI(code, context, mode, bestKey.key);
                case 'anthropic':
                    return await this.callAnthropic(code, context, mode, bestKey.key);
                case 'gemini':
                    return await this.callGemini(code, context, mode, bestKey.key);
                case 'custom':
                    return await this.callCustom(code, context, mode, bestKey.key);
                default:
                    return {
                        success: false,
                        content: '',
                        error: `Unsupported provider: ${bestKey.provider}`
                    };
            }
        } catch (error) {
            return {
                success: false,
                content: '',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Call OpenAI API
     */
    private async callOpenAI(code: string, context: string, mode: string, apiKey: string): Promise<ModelResponse> {
        const prompt = this.buildPrompt(code, context, mode);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as any;
        return {
            success: true,
            content: data.choices[0].message.content,
            error: undefined
        };
    }

    /**
     * Call Anthropic API
     */
    private async callAnthropic(code: string, context: string, mode: string, apiKey: string): Promise<ModelResponse> {
        const prompt = this.buildPrompt(code, context, mode);
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as any;
        return {
            success: true,
            content: data.content[0].text,
            error: undefined
        };
    }

    /**
     * Call Google Gemini API
     */
    private async callGemini(code: string, context: string, mode: string, apiKey: string): Promise<ModelResponse> {
        const prompt = this.buildPrompt(code, context, mode);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as any;
        return {
            success: true,
            content: data.candidates[0].content.parts[0].text,
            error: undefined
        };
    }

    /**
     * Call Custom API (user-defined endpoint)
     */
    private async callCustom(code: string, context: string, mode: string, apiKey: string): Promise<ModelResponse> {
        // Get custom API configuration from settings
        const customEndpoint = vscode.workspace.getConfiguration('knowcode').get<string>('customAPIEndpoint');
        const customHeaders = vscode.workspace.getConfiguration('knowcode').get<string>('customAPIHeaders');
        
        if (!customEndpoint) {
            return {
                success: false,
                content: '',
                error: 'Custom API endpoint not configured. Please set knowcode.customAPIEndpoint in VS Code settings.'
            };
        }

        try {
            const prompt = this.buildPrompt(code, context, mode);
            
            // Parse custom headers if provided
            let headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };
            
            if (customHeaders) {
                try {
                    const parsedHeaders = JSON.parse(customHeaders);
                    headers = { ...headers, ...parsedHeaders };
                } catch (error) {
                    console.log('KNOWCODE: Invalid custom headers format, using default');
                }
            }

            // Add API key to headers if not already present
            if (!headers['Authorization'] && !headers['X-API-Key']) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }

            const response = await fetch(customEndpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    prompt: prompt,
                    code: code,
                    context: context,
                    mode: mode
                })
            });

            if (!response.ok) {
                throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json() as any;
            
            // Handle different response formats
            let content = '';
            if (data.content) {
                content = data.content;
            } else if (data.text) {
                content = data.text;
            } else if (data.response) {
                content = data.response;
            } else if (data.message) {
                content = data.message;
            } else if (typeof data === 'string') {
                content = data;
            } else {
                content = JSON.stringify(data);
            }

            return {
                success: true,
                content: content,
                error: undefined
            };
        } catch (error) {
            return {
                success: false,
                content: '',
                error: `Custom API error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    /**
     * Build prompt based on mode
     */
    private buildPrompt(code: string, context: string, mode: string): string {
        const basePrompt = `Analyze and explain this code:

Code:
${code}

Context: ${context}

Provide a clear, comprehensive explanation that helps understand the code's purpose, logic, and implementation.`;

        switch (mode) {
            case 'explain5':
                return `Explain this code to me as if I'm a 5-year-old. 
Use simple words, analogies, and keep it short and fun. 
Avoid technical jargon unless absolutely necessary.

Here's the code:
${code}

Context: ${context}

Make it engaging with emojis and fun analogies that a 5-year-old would love! 🎈`;
            
            case 'interview':
                return `Explain this code as if you're answering a technical interview question:

Code:
${code}

Context: ${context}

Provide an interview-style explanation covering:
1. **What the code does** (high-level overview)
2. **Key concepts used** (algorithms, data structures, patterns)
3. **Time/Space complexity** (if applicable)
4. **Potential improvements** (optimizations, edge cases)
5. **Alternative approaches** (different solutions)

Format as a clear, professional interview response.`;
            
            case 'learning':
                return `Create step-by-step learning steps for this code:

Code:
${code}

Context: ${context}

Provide learning steps in this format:
**Step 1**: [First concept to understand]
**Step 2**: [Second concept to understand]
**Step 3**: [Third concept to understand]
[Continue for all major concepts]

Each step should build on the previous one and help understand the code progressively.`;
            
            default:
                return `${basePrompt}
- Clear and concise
- Focused on understanding
- Includes key concepts
- Provides practical insights`;
        }
    }

    /**
     * Check if cloud AI is available
     */
    public isAvailable(): boolean {
        return this.apiKeyManager.hasAnyAPIKeys();
    }

    /**
     * Get current provider info
     */
    public getCurrentProvider(): string | null {
        const bestKey = this.apiKeyManager.getBestAPIKey();
        return bestKey ? bestKey.provider : null;
    }
}
