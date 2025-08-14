import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SetupManager {
    private static instance: SetupManager;
    private context: vscode.ExtensionContext;
    private setupCompletedKey = 'knowcode.setupCompleted';
    private modelPathKey = 'knowcode.modelPath';
    private useLocalModelKey = 'knowcode.useLocalModel';

    private constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public static getInstance(context: vscode.ExtensionContext): SetupManager {
        if (!SetupManager.instance) {
            SetupManager.instance = new SetupManager(context);
        }
        return SetupManager.instance;
    }

    public async checkFirstRun(): Promise<void> {
        const setupCompleted = this.context.globalState.get<boolean>(this.setupCompletedKey, false);
        
        if (!setupCompleted) {
            await this.showFirstRunDialog();
        }
    }

    private async showFirstRunDialog(): Promise<void> {
        const message = `🚀 Welcome to KNOWCODE!

Do you want to run locally with no API key? (~2GB model download)

This will:
• Install Ollama silently (with your permission)
• Download CodeGemma model locally
• Enable offline code explanations

Choose your setup:`;

        const localOption = '🖥️ Local Mode (Recommended)';
        const cloudOption = '☁️ Cloud Mode (API Key Required)';
        const skipOption = '⏭️ Skip for now';

        const choice = await vscode.window.showInformationMessage(
            message,
            { modal: true },
            localOption,
            cloudOption,
            skipOption
        );

        switch (choice) {
            case localOption:
                await this.setupLocalMode();
                break;
            case cloudOption:
                await this.setupCloudMode();
                break;
            case skipOption:
                await this.skipSetup();
                break;
            default:
                // User closed the dialog
                await this.skipSetup();
                break;
        }
    }

    private async setupLocalMode(): Promise<void> {
        try {
            vscode.window.showInformationMessage('🔄 Setting up local mode...');

            // Check if Ollama is already installed
            const ollamaInstalled = await this.checkOllamaInstallation();
            
            if (!ollamaInstalled) {
                await this.installOllama();
            }

            // Download CodeGemma model
            await this.downloadCodeGemma();

            // Set configuration
            this.context.globalState.update(this.useLocalModelKey, true);
            this.context.globalState.update(this.setupCompletedKey, true);

            vscode.window.showInformationMessage(
                '✅ Local mode setup complete! KNOWCODE is ready to use with CodeGemma.',
                'Test Extension'
            );

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(
                `❌ Local setup failed: ${errorMessage}`,
                'Manual Installation Guide',
                'Skip Setup'
            ).then(async (choice) => {
                if (choice === 'Manual Installation Guide') {
                    await this.showManualInstallationGuide();
                } else {
                    await this.skipSetup();
                }
            });
        }
    }

    private async setupCloudMode(): Promise<void> {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Enter your API key for cloud-based models',
            password: true,
            placeHolder: 'sk-...'
        });

        if (apiKey) {
            // Store API key securely
            await this.context.secrets.store('knowcode.apiKey', apiKey);
            this.context.globalState.update(this.useLocalModelKey, false);
            this.context.globalState.update(this.setupCompletedKey, true);

            vscode.window.showInformationMessage(
                '✅ Cloud mode setup complete! KNOWCODE is ready to use with cloud models.',
                'Test Extension'
            );
        } else {
            await this.skipSetup();
        }
    }

    private async skipSetup(): Promise<void> {
        this.context.globalState.update(this.setupCompletedKey, true);
        vscode.window.showInformationMessage(
            '⏭️ Setup skipped. You can configure KNOWCODE later in settings.',
            'Open Settings'
        );
    }

    private async checkOllamaInstallation(): Promise<boolean> {
        try {
            await execAsync('ollama --version');
            return true;
        } catch {
            return false;
        }
    }

    private async installOllama(): Promise<void> {
        const platform = os.platform();
        
        vscode.window.showInformationMessage('📦 Installing Ollama...');

        try {
            if (platform === 'darwin') {
                // macOS - try multiple installation methods
                await this.installOllamaMacOS();
            } else if (platform === 'linux') {
                // Linux - try multiple installation methods
                await this.installOllamaLinux();
            } else if (platform === 'win32') {
                // Windows
                vscode.window.showInformationMessage(
                    'Please install Ollama manually from https://ollama.ai/download',
                    'Open Download Page'
                );
                throw new Error('Manual installation required on Windows');
            } else {
                throw new Error(`Unsupported platform: ${platform}`);
            }

            // Wait for Ollama to be available
            let attempts = 0;
            while (attempts < 10) {
                try {
                    await execAsync('ollama --version');
                    break;
                } catch {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    attempts++;
                }
            }

            if (attempts >= 10) {
                throw new Error('Ollama installation verification failed');
            }

        } catch (error) {
            throw new Error(`Ollama installation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async installOllamaMacOS(): Promise<void> {
        // Try multiple installation methods for macOS
        const methods = [
            // Method 1: Official install script
            async () => {
                await execAsync('curl -fsSL https://ollama.com/install.sh | sh');
            },
            // Method 2: Homebrew (if available)
            async () => {
                await execAsync('brew install ollama');
            },
            // Method 3: Manual download and install
            async () => {
                const tempDir = os.tmpdir();
                const downloadPath = path.join(tempDir, 'ollama-install.sh');
                
                // Download the install script
                await execAsync(`curl -fsSL https://ollama.com/install.sh -o ${downloadPath}`);
                
                // Make it executable
                await execAsync(`chmod +x ${downloadPath}`);
                
                // Run the install script
                await execAsync(`sh ${downloadPath}`);
                
                // Clean up
                await execAsync(`rm ${downloadPath}`);
            }
        ];

        let lastError: Error | null = null;
        
        for (const method of methods) {
            try {
                await method();
                return; // Success, exit
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');
                console.log(`Installation method failed: ${lastError.message}`);
                continue; // Try next method
            }
        }

        // If all methods failed, throw the last error
        if (lastError) {
            throw lastError;
        }
    }

    private async installOllamaLinux(): Promise<void> {
        // Try multiple installation methods for Linux
        const methods = [
            // Method 1: Official install script
            async () => {
                await execAsync('curl -fsSL https://ollama.com/install.sh | sh');
            },
            // Method 2: Manual download and install
            async () => {
                const tempDir = os.tmpdir();
                const downloadPath = path.join(tempDir, 'ollama-install.sh');
                
                // Download the install script
                await execAsync(`curl -fsSL https://ollama.com/install.sh -o ${downloadPath}`);
                
                // Make it executable
                await execAsync(`chmod +x ${downloadPath}`);
                
                // Run the install script
                await execAsync(`sh ${downloadPath}`);
                
                // Clean up
                await execAsync(`rm ${downloadPath}`);
            },
            // Method 3: Using wget if curl fails
            async () => {
                await execAsync('wget -qO- https://ollama.com/install.sh | sh');
            }
        ];

        let lastError: Error | null = null;
        
        for (const method of methods) {
            try {
                await method();
                return; // Success, exit
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');
                console.log(`Installation method failed: ${lastError.message}`);
                continue; // Try next method
            }
        }

        // If all methods failed, throw the last error
        if (lastError) {
            throw lastError;
        }
    }

    private async downloadCodeGemma(): Promise<void> {
        vscode.window.showInformationMessage('📥 Downloading a code-optimized model...');

        try {
            // Try multiple smaller, faster models
            const models = [
                'llama2:7b',
                'codellama:7b-code',
                'llama2:7b-chat'
            ];

            let success = false;
            for (const model of models) {
                try {
                    vscode.window.showInformationMessage(`📥 Trying to download ${model}...`);
                    await execAsync(`ollama pull ${model}`);
                    vscode.window.showInformationMessage(`✅ ${model} downloaded successfully!`);
                    success = true;
                    break;
                } catch (error) {
                    console.log(`Failed to download ${model}: ${error}`);
                    continue;
                }
            }

            if (!success) {
                throw new Error('Failed to download any compatible model');
            }
        } catch (error) {
            throw new Error(`Model download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getModelConfiguration(): Promise<{
        useLocalModel: boolean;
        modelPath?: string;
        apiKey?: string;
    }> {
        const useLocalModel = this.context.globalState.get<boolean>(this.useLocalModelKey, false);
        const modelPath = this.context.globalState.get<string>(this.modelPathKey);
        
        let apiKey: string | undefined;
        if (!useLocalModel) {
            apiKey = await this.context.secrets.get('knowcode.apiKey');
        }

        return {
            useLocalModel,
            modelPath,
            apiKey
        };
    }

    public async testLocalModel(): Promise<boolean> {
        try {
            // Try to find any available model
            const { stdout } = await execAsync('ollama list');
            const lines = stdout.split('\n');
            let modelName = 'llama2:7b'; // default
            
            for (const line of lines) {
                if (line.trim() && !line.includes('NAME') && !line.includes('---')) {
                    const parts = line.split(/\s+/);
                    if (parts[0]) {
                        modelName = parts[0];
                        break;
                    }
                }
            }
            
            const { stdout: response } = await execAsync(`ollama run ${modelName} "Hello, world!"`);
            return response.includes('Hello') || response.length > 0;
        } catch {
            return false;
        }
    }

    public async restartOllama(): Promise<void> {
        try {
            await execAsync('pkill ollama');
            await new Promise(resolve => setTimeout(resolve, 2000));
            await execAsync('ollama serve');
        } catch (error) {
            vscode.window.showWarningMessage('Could not restart Ollama. Please restart it manually.');
        }
    }

    public async openSettings(): Promise<void> {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'knowcode');
    }

    private async showManualInstallationGuide(): Promise<void> {
        const platform = os.platform();
        let instructions = '';

        if (platform === 'darwin') {
            instructions = `# 🍎 Manual Ollama Installation for macOS

## Method 1: Homebrew (Recommended)
\`\`\`bash
brew install ollama
\`\`\`

 ## Method 2: Official Install Script
 \`\`\`bash
 curl -fsSL https://ollama.com/install.sh | sh
 \`\`\`

 ## Method 3: Manual Download
 1. Visit https://ollama.com/download
 2. Download the macOS version
3. Install the downloaded package

## After Installation
\`\`\`bash
# Start Ollama
ollama serve

# Download CodeGemma model
ollama pull codellama:7b-code

# Test the installation
ollama run codellama:7b-code "Hello"
\`\`\`

## Troubleshooting
- If you get permission errors, try: \`sudo chmod +x /usr/local/bin/ollama\`
- If Homebrew is not installed: \`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\``;
        } else if (platform === 'linux') {
            instructions = `# 🐧 Manual Ollama Installation for Linux

 ## Method 1: Official Install Script
 \`\`\`bash
 curl -fsSL https://ollama.com/install.sh | sh
 \`\`\`

 ## Method 2: Using wget
 \`\`\`bash
 wget -qO- https://ollama.com/install.sh | sh
 \`\`\`

 ## Method 3: Manual Download
 1. Visit https://ollama.com/download
 2. Download the Linux version
3. Extract and install manually

## After Installation
\`\`\`bash
# Start Ollama
ollama serve

# Download CodeGemma model
ollama pull codellama:7b-code

# Test the installation
ollama run codellama:7b-code "Hello"
\`\`\`

## Troubleshooting
- If you get permission errors, try: \`sudo chmod +x /usr/local/bin/ollama\`
- If curl/wget fails, check your internet connection`;
        } else {
            instructions = `# 🪟 Manual Ollama Installation for Windows

 ## Method 1: Official Download
 1. Visit https://ollama.com/download
2. Download the Windows version
3. Run the installer as administrator

## Method 2: Using Chocolatey
\`\`\`powershell
choco install ollama
\`\`\`

## After Installation
\`\`\`powershell
# Start Ollama
ollama serve

# Download CodeGemma model
ollama pull codellama:7b-code

# Test the installation
ollama run codellama:7b-code "Hello"
\`\`\`

## Troubleshooting
- Make sure to run as administrator if you get permission errors
- Check Windows Defender settings if installation fails`;
        }

        const panel = vscode.window.createWebviewPanel(
            'manualInstallation',
            'Manual Ollama Installation Guide',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Manual Ollama Installation</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; line-height: 1.6; }
                    h1 { color: #007acc; }
                    code { background: #f3f3f3; padding: 2px 4px; border-radius: 3px; }
                    pre { background: #f3f3f3; padding: 15px; border-radius: 5px; overflow-x: auto; }
                    .button { background: #007acc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
                    .button:hover { background: #005a9e; }
                </style>
            </head>
            <body>
                <h1>🔧 Manual Ollama Installation Guide</h1>
                <p>Follow these instructions to install Ollama manually:</p>
                ${instructions.replace(/\n/g, '<br>').replace(/```bash/g, '<pre><code>').replace(/```/g, '</code></pre>').replace(/`([^`]+)`/g, '<code>$1</code>')}
                <br><br>
                <button class="button" onclick="window.close()">Close</button>
                                 <button class="button" onclick="window.open('https://ollama.com/download', '_blank')">Download Ollama</button>
            </body>
            </html>
        `;
    }
}
