import { LocalModelService } from './LocalModelService';
import { CloudAIService } from './CloudAIService';
import { APIKeyManager } from './APIKeyManager';

export interface ModelResponse {
    success: boolean;
    content: string;
    error?: string;
}

export class UnifiedAIService {
    private static instance: UnifiedAIService;
    private localModelService: LocalModelService;
    private cloudAIService: CloudAIService;
    private apiKeyManager: APIKeyManager;
    private preferredProvider: 'local' | 'cloud' | 'auto' = 'auto';

    private constructor(apiKeyManager: APIKeyManager) {
        this.apiKeyManager = apiKeyManager;
        this.localModelService = LocalModelService.getInstance();
        this.cloudAIService = CloudAIService.getInstance(apiKeyManager);
    }

    public static getInstance(apiKeyManager: APIKeyManager): UnifiedAIService {
        if (!UnifiedAIService.instance) {
            UnifiedAIService.instance = new UnifiedAIService(apiKeyManager);
        }
        return UnifiedAIService.instance;
    }

    /**
     * Set preferred AI provider
     */
    public setPreferredProvider(provider: 'local' | 'cloud' | 'auto'): void {
        this.preferredProvider = provider;
    }

    /**
     * Get current AI provider info
     */
    public getCurrentProviderInfo(): { provider: string; details: string } {
        if (this.preferredProvider === 'local') {
            return {
                provider: 'Local Ollama',
                details: 'Using llama2:7b-chat model'
            };
        }

        if (this.preferredProvider === 'cloud') {
            const cloudProvider = this.cloudAIService.getCurrentProvider();
            if (cloudProvider) {
                return {
                    provider: `Cloud (${cloudProvider.toUpperCase()})`,
                    details: `Using ${cloudProvider} API`
                };
            }
        }

        // Auto mode - determine best available
        if (this.cloudAIService.isAvailable()) {
            const cloudProvider = this.cloudAIService.getCurrentProvider();
            return {
                provider: `Cloud (${cloudProvider?.toUpperCase()})`,
                details: `Using ${cloudProvider} API`
            };
        } else {
            return {
                provider: 'Local Ollama',
                details: 'Using llama2:7b-chat model (no cloud API configured)'
            };
        }
    }

    /**
     * Generate explanation using the best available AI provider
     */
    public async generateExplanation(
        code: string,
        context: string,
        mode: string = 'default'
    ): Promise<ModelResponse> {
        console.log('KNOWCODE: UnifiedAIService.generateExplanation called with mode:', mode);
        console.log('KNOWCODE: Preferred provider:', this.preferredProvider);

        // Determine which provider to use
        const provider = this.determineProvider();
        console.log('KNOWCODE: Using provider:', provider);

        try {
            if (provider === 'cloud') {
                console.log('KNOWCODE: Using cloud AI service');
                return await this.cloudAIService.generateExplanation(code, context, mode);
            } else {
                console.log('KNOWCODE: Using local AI service');
                return await this.localModelService.generateExplanation(code, context, mode);
            }
        } catch (error) {
            console.log('KNOWCODE: Error in unified AI service:', error);
            
            // Fallback to local if cloud fails
            if (provider === 'cloud') {
                console.log('KNOWCODE: Cloud failed, falling back to local');
                return await this.localModelService.generateExplanation(code, context, mode);
            }
            
            return {
                success: false,
                content: '',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Generate "Explain like I'm 5" explanation
     */
    public async generateExplainLike5(code: string, context: string): Promise<ModelResponse> {
        console.log('KNOWCODE: UnifiedAIService.generateExplainLike5 called');
        
        // For explain5, prefer local model as it's optimized for this
        const provider = this.determineProviderForExplain5();
        console.log('KNOWCODE: Explain5 using provider:', provider);

        try {
            if (provider === 'cloud') {
                console.log('KNOWCODE: Using cloud AI for explain5');
                return await this.cloudAIService.generateExplanation(code, context, 'explain5');
            } else {
                console.log('KNOWCODE: Using local AI for explain5');
                return await this.localModelService.generateExplainLike5(code, context);
            }
        } catch (error) {
            console.log('KNOWCODE: Error in explain5 generation:', error);
            
            // Fallback to local if cloud fails
            if (provider === 'cloud') {
                console.log('KNOWCODE: Cloud failed for explain5, falling back to local');
                return await this.localModelService.generateExplainLike5(code, context);
            }
            
            return {
                success: false,
                content: '',
                error: error instanceof Error ? error.message : 'Unknown error in explain5 generation'
            };
        }
    }

    /**
     * Determine which provider to use based on preferences and availability
     */
    private determineProvider(): 'local' | 'cloud' {
        if (this.preferredProvider === 'local') {
            return 'local';
        }

        if (this.preferredProvider === 'cloud') {
            if (this.cloudAIService.isAvailable()) {
                return 'cloud';
            } else {
                console.log('KNOWCODE: Cloud preferred but not available, using local');
                return 'local';
            }
        }

        // Auto mode - prefer cloud if available, otherwise local
        if (this.cloudAIService.isAvailable()) {
            return 'cloud';
        } else {
            return 'local';
        }
    }

    /**
     * Determine provider specifically for explain5 (prefer local for better results)
     */
    private determineProviderForExplain5(): 'local' | 'cloud' {
        if (this.preferredProvider === 'local') {
            return 'local';
        }

        if (this.preferredProvider === 'cloud') {
            if (this.cloudAIService.isAvailable()) {
                return 'cloud';
            } else {
                return 'local';
            }
        }

        // Auto mode - prefer local for explain5 as it's optimized for this
        if (this.localModelService.getModelReadyStatus()) {
            return 'local';
        } else if (this.cloudAIService.isAvailable()) {
            return 'cloud';
        } else {
            return 'local';
        }
    }

    /**
     * Test connection to both providers
     */
    public async testConnections(): Promise<{
        local: boolean;
        cloud: boolean;
        details: string;
    }> {
        const results = {
            local: false,
            cloud: false,
            details: ''
        };

        // Test local connection
        try {
            results.local = await this.localModelService.testConnection();
        } catch (error) {
            console.log('KNOWCODE: Local connection test failed:', error);
        }

        // Test cloud connection
        try {
            results.cloud = this.cloudAIService.isAvailable();
        } catch (error) {
            console.log('KNOWCODE: Cloud connection test failed:', error);
        }

        // Build details message
        const details = [];
        if (results.local) {
            details.push('✅ Local Ollama: Ready');
        } else {
            details.push('❌ Local Ollama: Not available');
        }

        if (results.cloud) {
            const provider = this.cloudAIService.getCurrentProvider();
            details.push(`✅ Cloud API (${provider}): Ready`);
        } else {
            details.push('❌ Cloud API: No keys configured');
        }

        results.details = details.join('\n');

        return results;
    }

    /**
     * Get provider status
     */
    public getProviderStatus(): {
        preferred: string;
        available: string[];
        current: string;
    } {
        const available = [];
        if (this.localModelService.getModelReadyStatus()) {
            available.push('local');
        }
        if (this.cloudAIService.isAvailable()) {
            available.push('cloud');
        }

        const current = this.determineProvider();
        const currentInfo = this.getCurrentProviderInfo();

        return {
            preferred: this.preferredProvider,
            available,
            current: currentInfo.provider
        };
    }
}
