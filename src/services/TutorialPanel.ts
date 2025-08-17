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
                .highlight {
                    background: var(--vscode-textPreformat-foreground);
                    color: var(--vscode-textPreformat-background);
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    color: var(--vscode-descriptionForeground);
                    font-size: 0.9em;
                    margin-top: 30px;
                }
                .demo-code {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 15px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    border-left: 4px solid var(--vscode-textLink-foreground);
                    margin: 10px 0;
                    position: relative;
                }
                .demo-code::before {
                    content: "Try selecting this code!";
                    position: absolute;
                    top: -10px;
                    left: 10px;
                    background: var(--vscode-textLink-foreground);
                    color: white;
                    padding: 2px 8px;
                    border-radius: 3px;
                    font-size: 11px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>KNOWCODE Tutorial</h1>
                <p>Learn how to use KNOWCODE to understand code better with analogies and visual diagrams</p>
            </div>

            <div class="section">
                <h2>Quick Start (30 seconds)</h2>
                <div class="step">
                    <span class="step-number">1.</span> <span class="highlight">Select a few lines of code</span> in your editor (this is important!)
                </div>
                <div class="step">
                    <span class="step-number">2.</span> Press <span class="keybinding">Ctrl+Shift+5</span> (or <span class="keybinding">Cmd+Shift+5</span> on Mac) for "Explain Like I'm 5"
                </div>
                <div class="step">
                    <span class="step-number">3.</span> Get a simple explanation with <span class="highlight">analogies and visual diagrams</span>!
                </div>
                
                <div class="tip">
                    <strong>Pro Tip:</strong> Select 5-20 lines of code for the best explanations. Too much code can be overwhelming, too little might not provide enough context.
                </div>
            </div>

            <div class="section">
                <h2>Try This Example</h2>
                <p>Copy this code into a new file and try KNOWCODE:</p>
                <div class="demo-code">
function calculateTotal(items) {
    return items
        .filter(item => item.inStock)
        .map(item => item.price * item.quantity)
        .reduce((sum, price) => sum + price, 0);
}
                </div>
                <p>Select the function and press <span class="keybinding">Ctrl+Shift+5</span> to see it explained with analogies!</p>
            </div>

            <div class="section">
                <h2>Available Features</h2>
                
                <h3>Explain Like I'm 5</h3>
                <p>Get simple explanations using analogies, visual diagrams, and plain language.</p>
                <div class="keybinding">Ctrl+Shift+5</div>
                <div class="tip">
                    <strong>What you'll get:</strong> Analogies (like "it's like sorting toys"), bullet points, glossary terms, and Mermaid diagrams showing the code flow.
                </div>
                
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
                <h2>What Makes KNOWCODE Special</h2>
                
                <h3>Analogies & Visual Learning</h3>
                <p>KNOWCODE doesn't just explain code - it makes it relatable:</p>
                <ul>
                    <li><strong>Analogies:</strong> "This function is like a factory assembly line"</li>
                    <li><strong>Visual Diagrams:</strong> Mermaid flowcharts showing code logic</li>
                    <li><strong>Simple Language:</strong> No jargon, just clear explanations</li>
                    <li><strong>Step-by-Step:</strong> Break complex code into digestible pieces</li>
                </ul>
                
                <h3>Perfect for Learning</h3>
                <p>Whether you're a beginner or experienced developer:</p>
                <ul>
                    <li><strong>Beginners:</strong> Understand complex code with simple analogies</li>
                    <li><strong>Students:</strong> Learn programming concepts visually</li>
                    <li><strong>Professionals:</strong> Quickly understand unfamiliar codebases</li>
                    <li><strong>Teachers:</strong> Create educational content with diagrams</li>
                </ul>
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
                <h2>Pro Tips for Best Results</h2>
                <ul>
                    <li><span class="highlight">Select 5-20 lines</span> of code for optimal explanations</li>
                    <li>Choose complete functions or logical code blocks</li>
                    <li>Use Learning Mode for complex algorithms</li>
                    <li>Generate MCQs to test your understanding</li>
                    <li>Use Interview Mode to prepare for technical interviews</li>
                    <li>Create projects from interesting code snippets</li>
                    <li>Look for analogies and visual diagrams in explanations</li>
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
