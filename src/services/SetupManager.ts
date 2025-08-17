import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SetupManager {
    private context: vscode.ExtensionContext;
    private isSetupComplete = false;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    async checkAndSetupOllama(): Promise<boolean> {
        // Check if Ollama is already installed and running
        if (await this.isOllamaRunning()) {
            console.log('Ollama is already running');
            return true;
        }

        // Check if Ollama is installed but not running
        if (await this.isOllamaInstalled()) {
            console.log('Ollama is installed but not running, starting it...');
            await this.startOllama();
            return true;
        }

        // Ollama is not installed, offer to install it
        const installChoice = await vscode.window.showInformationMessage(
            'KNOWCODE needs Ollama for local AI. Would you like to install it automatically?',
            'Install Ollama',
            'Manual Setup',
            'Cancel'
        );

        if (installChoice === 'Install Ollama') {
            return await this.installOllama();
        } else if (installChoice === 'Manual Setup') {
            this.showManualSetupGuide();
            return false;
        }

        return false;
    }

    private async isOllamaRunning(): Promise<boolean> {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            return response.ok;
        } catch {
            return false;
        }
    }

    private async isOllamaInstalled(): Promise<boolean> {
        try {
            if (process.platform === 'win32') {
                await execAsync('ollama --version');
            } else {
                await execAsync('which ollama');
            }
            return true;
        } catch {
            return false;
        }
    }

    private async installOllama(): Promise<boolean> {
        try {
            vscode.window.showInformationMessage('Installing Ollama... This may take a few minutes.');

            if (process.platform === 'darwin') {
                // macOS
                await this.installOllamaMac();
            } else if (process.platform === 'win32') {
                // Windows
                await this.installOllamaWindows();
            } else {
                // Linux
                await this.installOllamaLinux();
            }

            // Start Ollama
            await this.startOllama();

            // Download the model
            await this.downloadModel();

            vscode.window.showInformationMessage('Ollama installed successfully! KNOWCODE is ready to use.');
            return true;

        } catch (error) {
            vscode.window.showErrorMessage(`Failed to install Ollama: ${error}`);
            this.showManualSetupGuide();
            return false;
        }
    }

    private async installOllamaMac(): Promise<void> {
        // Use Homebrew if available, otherwise use curl
        try {
            await execAsync('brew --version');
            await execAsync('brew install ollama');
        } catch {
            // Fallback to curl installation
            await execAsync('curl -fsSL https://ollama.ai/install.sh | sh');
        }
    }

    private async installOllamaWindows(): Promise<void> {
        // Download and run the Windows installer
        const installerUrl = 'https://github.com/ollama/ollama/releases/latest/download/ollama-windows-amd64.msi';
        const installerPath = path.join(this.context.globalStorageUri.fsPath, 'ollama-installer.msi');
        
        // Create directory if it doesn't exist
        const dir = path.dirname(installerPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Download installer
        const response = await fetch(installerUrl);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(installerPath, Buffer.from(buffer));

        // Run installer
        await execAsync(`msiexec /i "${installerPath}" /quiet`);
    }

    private async installOllamaLinux(): Promise<void> {
        await execAsync('curl -fsSL https://ollama.ai/install.sh | sh');
    }

    private async startOllama(): Promise<void> {
        try {
            // Start Ollama in the background using spawn
            const ollamaProcess = spawn('ollama', ['serve'], {
                detached: true,
                stdio: 'ignore'
            });
            
            // Unref the process so it can run independently
            ollamaProcess.unref();
            
            // Wait for Ollama to start
            let attempts = 0;
            while (attempts < 30) {
                if (await this.isOllamaRunning()) {
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
            }
            
            throw new Error('Ollama failed to start within 30 seconds');
        } catch (error) {
            throw new Error(`Failed to start Ollama: ${error}`);
        }
    }

    private async downloadModel(): Promise<void> {
        try {
            vscode.window.showInformationMessage('Downloading AI model... This may take several minutes.');
            
            const config = vscode.workspace.getConfiguration('knowcode');
            const modelName = config.get('localModelName', 'llama2:7b-chat');
            
            await execAsync(`ollama pull ${modelName}`);
            
            vscode.window.showInformationMessage('Model downloaded successfully!');
        } catch (error) {
            vscode.window.showWarningMessage(`Failed to download model: ${error}. You can download it manually with 'ollama pull llama2:7b-chat'`);
        }
    }

    private showManualSetupGuide(): void {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeSetup',
            'KNOWCODE Setup Guide',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = this.generateSetupHTML();
    }

    private generateSetupHTML(): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>KNOWCODE Setup Guide</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: var(--vscode-editor-background);
                    color: var(--vscode-editor-foreground);
                    line-height: 1.6;
                }
                .header {
                    border-bottom: 2px solid var(--vscode-focusBorder);
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .section {
                    background: var(--vscode-input-background);
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 6px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .code-block {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 15px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    border-left: 4px solid var(--vscode-textLink-foreground);
                    margin: 10px 0;
                }
                .step {
                    margin-bottom: 15px;
                    padding-left: 20px;
                    border-left: 3px solid var(--vscode-textLink-foreground);
                }
                .step-number {
                    font-weight: bold;
                    color: var(--vscode-textLink-foreground);
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>KNOWCODE Setup Guide</h1>
                <p>Follow these steps to install Ollama and get KNOWCODE working</p>
            </div>

            <div class="section">
                <h2>Step 1: Install Ollama</h2>
                
                <h3>macOS:</h3>
                <div class="code-block">curl -fsSL https://ollama.ai/install.sh | sh</div>
                
                <h3>Windows:</h3>
                <div class="step">
                    <span class="step-number">1.</span> Download from: <a href="https://ollama.ai/download">https://ollama.ai/download</a>
                </div>
                <div class="step">
                    <span class="step-number">2.</span> Run the installer
                </div>
                
                <h3>Linux:</h3>
                <div class="code-block">curl -fsSL https://ollama.ai/install.sh | sh</div>
            </div>

            <div class="section">
                <h2>Step 2: Download AI Model</h2>
                <div class="code-block">ollama pull llama2:7b-chat</div>
                <p>This will download about 4GB and may take several minutes.</p>
            </div>

            <div class="section">
                <h2>Step 3: Start Ollama</h2>
                <div class="code-block">ollama serve</div>
                <p>Keep this running in a terminal window.</p>
            </div>

            <div class="section">
                <h2>Step 4: Test KNOWCODE</h2>
                <div class="step">
                    <span class="step-number">1.</span> Open any code file in VS Code
                </div>
                <div class="step">
                    <span class="step-number">2.</span> Select 5-20 lines of code
                </div>
                <div class="step">
                    <span class="step-number">3.</span> Press Ctrl+Shift+5 (or Cmd+Shift+5 on Mac)
                </div>
            </div>

            <div class="section">
                <h2>Troubleshooting</h2>
                <ul>
                    <li><strong>Ollama not found:</strong> Make sure you've installed it and it's in your PATH</li>
                    <li><strong>Model not found:</strong> Run 'ollama pull llama2:7b-chat' to download it</li>
                    <li><strong>Connection refused:</strong> Make sure 'ollama serve' is running</li>
                    <li><strong>Out of memory:</strong> The model needs at least 4GB RAM</li>
                </ul>
            </div>
        </body>
        </html>
        `;
    }
}
