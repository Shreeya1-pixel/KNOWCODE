import * as vscode from 'vscode';

export class TutorialPanel {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    createPanel() {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeTutorial',
            'KNOWCODE Tutorial',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.generateTutorialHTML();
    }

    private generateTutorialHTML(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>KNOWCODE Tutorial</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
                .header h1 {
                    margin: 0;
                    color: var(--vscode-textLink-foreground);
                }
                .section {
                    background: var(--vscode-input-background);
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 6px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .section h2 {
                    color: var(--vscode-textLink-foreground);
                    margin-top: 0;
                }
                .keybinding {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    border: 1px solid var(--vscode-input-border);
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
                .code-example {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 15px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    border-left: 4px solid var(--vscode-textLink-foreground);
                    margin: 10px 0;
                }
                .tip {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 10px;
                    border-radius: 4px;
                    border-left: 4px solid var(--vscode-textPreformat-foreground);
                    margin: 10px 0;
                }
                .footer {
                    text-align: center;
                    color: var(--vscode-descriptionForeground);
                    font-size: 0.9em;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>KNOWCODE Tutorial</h1>
                <p>Learn how to use KNOWCODE to understand code better</p>
            </div>

            <div class="section">
                <h2>Quick Start</h2>
                <div class="step">
                    <span class="step-number">1.</span> Select some code in your editor
                </div>
                <div class="step">
                    <span class="step-number">2.</span> Press <span class="keybinding">Ctrl+Shift+5</span> (or <span class="keybinding">Cmd+Shift+5</span> on Mac) for "Explain Like I'm 5"
                </div>
                <div class="step">
                    <span class="step-number">3.</span> Get a simple, easy-to-understand explanation!
                </div>
            </div>

            <div class="section">
                <h2>Available Features</h2>
                
                <h3>Explain Like I'm 5</h3>
                <p>Get simple explanations using analogies and plain language.</p>
                <div class="keybinding">Ctrl+Shift+5</div>
                
                <h3>Learning Mode</h3>
                <p>Step-by-step learning progression with increasing complexity.</p>
                <div class="keybinding">Ctrl+Shift+L</div>
                
                <h3>Interview Mode</h3>
                <p>Technical analysis with complexity, trade-offs, and optimization tips.</p>
                <div class="keybinding">Ctrl+Shift+I</div>
                
                <h3>Generate MCQs</h3>
                <p>Create multiple-choice questions to test understanding.</p>
                <p>Use Command Palette: "KNOWCODE: Generate MCQs"</p>
                
                <h3>Generate Project</h3>
                <p>Turn code into complete learning projects.</p>
                <p>Use Command Palette: "KNOWCODE: Generate Project"</p>
            </div>

            <div class="section">
                <h2>Example Code to Try</h2>
                <div class="code-example">
// Try selecting this code and using KNOWCODE!
const result = data.reduce((acc, curr) => 
  acc.concat(curr.filter(x => x.status === 'active')
    .map(x => ({ ...x, processed: true }))), []);
                </div>
            </div>

            <div class="section">
                <h2>Setup Requirements</h2>
                
                <h3>Local AI (Recommended)</h3>
                <div class="step">
                    <span class="step-number">1.</span> Install Ollama: <span class="code-example">curl -fsSL https://ollama.ai/install.sh | sh</span>
                </div>
                <div class="step">
                    <span class="step-number">2.</span> Pull the model: <span class="code-example">ollama pull llama3.1:8b-instruct</span>
                </div>
                <div class="step">
                    <span class="step-number">3.</span> Start Ollama: <span class="code-example">ollama serve</span>
                </div>
                
                <div class="tip">
                    <strong>Tip:</strong> Local AI keeps your code private and works offline!
                </div>
            </div>

            <div class="section">
                <h2>Alternative: Cloud AI</h2>
                <p>If you prefer cloud-based AI:</p>
                <div class="step">
                    <span class="step-number">1.</span> Get an OpenAI API key
                </div>
                <div class="step">
                    <span class="step-number">2.</span> Open VS Code Settings
                </div>
                <div class="step">
                    <span class="step-number">3.</span> Search for "KNOWCODE"
                </div>
                <div class="step">
                    <span class="step-number">4.</span> Enter your OpenAI API key
                </div>
            </div>

            <div class="section">
                <h2>Pro Tips</h2>
                <ul>
                    <li>Select specific functions or code blocks for better explanations</li>
                    <li>Use Learning Mode for complex algorithms</li>
                    <li>Generate MCQs to test your understanding</li>
                    <li>Use Interview Mode to prepare for technical interviews</li>
                    <li>Create projects from interesting code snippets</li>
                </ul>
            </div>

            <div class="footer">
                <p>KNOWCODE - Making code understandable for everyone</p>
                <p>Press <span class="keybinding">Ctrl+Shift+P</span> and type "KNOWCODE" to see all commands</p>
            </div>
        </body>
        </html>
        `;
    }
}
