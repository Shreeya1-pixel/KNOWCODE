import * as vscode from 'vscode';
import * as crypto from 'crypto';

export interface APIKeyConfig {
    openai?: string;
    anthropic?: string;
    gemini?: string;
    custom?: string;
}

export class APIKeyManager {
    private static instance: APIKeyManager;
    private context: vscode.ExtensionContext;
    private configKey = 'knowcode.apiKeys';

    private constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public static getInstance(context?: vscode.ExtensionContext): APIKeyManager {
        if (!APIKeyManager.instance && context) {
            APIKeyManager.instance = new APIKeyManager(context);
        }
        return APIKeyManager.instance;
    }

    /**
     * Get all stored API keys
     */
    public getAPIKeys(): APIKeyConfig {
        const encryptedKeys = this.context.globalState.get<string>(this.configKey);
        if (!encryptedKeys) {
            return {};
        }
        
        try {
            const decrypted = this.decrypt(encryptedKeys);
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Error decrypting API keys:', error);
            return {};
        }
    }

    /**
     * Store API keys securely
     */
    public async setAPIKeys(keys: APIKeyConfig): Promise<void> {
        try {
            const encrypted = this.encrypt(JSON.stringify(keys));
            await this.context.globalState.update(this.configKey, encrypted);
        } catch (error) {
            console.error('Error encrypting API keys:', error);
            throw new Error('Failed to store API keys securely');
        }
    }

    /**
     * Get a specific API key
     */
    public getAPIKey(provider: keyof APIKeyConfig): string | undefined {
        const keys = this.getAPIKeys();
        return keys[provider];
    }

    /**
     * Set a specific API key
     */
    public async setAPIKey(provider: keyof APIKeyConfig, key: string): Promise<void> {
        const keys = this.getAPIKeys();
        keys[provider] = key;
        await this.setAPIKeys(keys);
    }

    /**
     * Remove a specific API key
     */
    public async removeAPIKey(provider: keyof APIKeyConfig): Promise<void> {
        const keys = this.getAPIKeys();
        delete keys[provider];
        await this.setAPIKeys(keys);
    }

    /**
     * Check if any API keys are configured
     */
    public hasAnyAPIKeys(): boolean {
        const keys = this.getAPIKeys();
        return Object.values(keys).some(key => key && key.trim() !== '');
    }

    /**
     * Get the best available API key (prioritizes OpenAI, then others)
     */
    public getBestAPIKey(): { provider: string; key: string } | null {
        const keys = this.getAPIKeys();
        
        // Priority order: OpenAI, Anthropic, Gemini, Custom
        const providers: (keyof APIKeyConfig)[] = ['openai', 'anthropic', 'gemini', 'custom'];
        
        for (const provider of providers) {
            const key = keys[provider];
            if (key && key.trim() !== '') {
                return { provider, key };
            }
        }
        
        return null;
    }

    /**
     * Show API key management UI
     */
    public async showAPIKeyManager(): Promise<void> {
        const currentKeys = this.getAPIKeys();
        
        const openaiKey = await vscode.window.showInputBox({
            prompt: 'Enter your OpenAI API Key (optional)',
            password: true,
            value: currentKeys.openai || '',
            placeHolder: 'sk-...'
        });

        const anthropicKey = await vscode.window.showInputBox({
            prompt: 'Enter your Anthropic API Key (optional)',
            password: true,
            value: currentKeys.anthropic || '',
            placeHolder: 'sk-ant-...'
        });

        const geminiKey = await vscode.window.showInputBox({
            prompt: 'Enter your Google Gemini API Key (optional)',
            password: true,
            value: currentKeys.gemini || '',
            placeHolder: 'AIza...'
        });

        const customKey = await vscode.window.showInputBox({
            prompt: 'Enter your Custom API Key (optional)',
            password: true,
            value: currentKeys.custom || '',
            placeHolder: 'Your custom API key'
        });

        // Update keys (only if user provided input)
        const newKeys: APIKeyConfig = {};
        if (openaiKey !== undefined) newKeys.openai = openaiKey;
        if (anthropicKey !== undefined) newKeys.anthropic = anthropicKey;
        if (geminiKey !== undefined) newKeys.gemini = geminiKey;
        if (customKey !== undefined) newKeys.custom = customKey;

        if (Object.keys(newKeys).length > 0) {
            await this.setAPIKeys(newKeys);
            vscode.window.showInformationMessage('API keys updated successfully! 🔑');
        }
    }

    /**
     * Show current API key status
     */
    public async showAPIKeyStatus(): Promise<void> {
        const keys = this.getAPIKeys();
        const bestKey = this.getBestAPIKey();
        
        let message = '**KNOWCODE API Key Status**\n\n';
        
        if (bestKey) {
            message += `✅ **Active Provider**: ${bestKey.provider.toUpperCase()}\n`;
            message += `🔑 **Key**: ${bestKey.key.substring(0, 8)}...\n\n`;
        } else {
            message += '❌ **No API keys configured**\n\n';
        }
        
        message += '**Configured Providers**:\n';
        Object.entries(keys).forEach(([provider, key]) => {
            const status = key && key.trim() !== '' ? '✅' : '❌';
            message += `${status} ${provider.toUpperCase()}\n`;
        });
        
        message += '\n**Note**: KNOWCODE will use your local Ollama model if no API keys are configured.';
        
        await vscode.window.showInformationMessage(message);
    }

    /**
     * Simple encryption for API keys
     */
    private encrypt(text: string): string {
        // In a real implementation, you'd use a more secure method
        // This is a simple base64 encoding for demonstration
        return Buffer.from(text).toString('base64');
    }

    /**
     * Simple decryption for API keys
     */
    private decrypt(encryptedText: string): string {
        // In a real implementation, you'd use a more secure method
        // This is a simple base64 decoding for demonstration
        return Buffer.from(encryptedText, 'base64').toString('utf8');
    }
}
