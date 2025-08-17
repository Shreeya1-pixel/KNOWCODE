import * as vscode from 'vscode';
import { LocalAIService } from './LocalAIService';

export class KNOWCODEPanel {
    private panel: vscode.WebviewPanel | undefined;
    private localAIService: LocalAIService;

    constructor(context: vscode.ExtensionContext, localAIService: LocalAIService) {
        this.localAIService = localAIService;
    }

    public createPanel(): void {
        if (this.panel) {
            this.panel.reveal();
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'knowcodePanel',
            'KNOWCODE',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this.panel.webview.html = this.generateHTML();
        this.setupMessageHandlers();

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }

    private generateHTML(): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    
                    .header {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 20px;
                        color: var(--vscode-editor-foreground);
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 10px;
                    }
                    
                    .button {
                        display: block;
                        width: 100%;
                        padding: 12px 16px;
                        margin-bottom: 10px;
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: 1px solid var(--vscode-button-border);
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        text-align: left;
                        transition: background-color 0.2s;
                    }
                    
                    .button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                    
                    .button:active {
                        background-color: var(--vscode-button-activeBackground);
                    }
                    
                    .status {
                        margin-top: 20px;
                        padding: 10px;
                        background-color: var(--vscode-input-background);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 4px;
                        font-size: 12px;
                    }
                    
                    .keybinding {
                        background: var(--vscode-textBlockQuote-background);
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-family: 'Monaco', 'Menlo', monospace;
                        font-size: 12px;
                        margin-left: 8px;
                    }
                </style>
            </head>
            <body>
                <div class="header">KNOWCODE - Code Learning Assistant</div>
                
                <button class="button" onclick="explainLike5()">
                    Explain Like I'm 5 <span class="keybinding">Ctrl+Shift+5</span>
                </button>
                
                <button class="button" onclick="learningMode()">
                    Learning Mode <span class="keybinding">Ctrl+Shift+L</span>
                </button>
                
                <button class="button" onclick="interviewMode()">
                    Interview Mode <span class="keybinding">Ctrl+Shift+I</span>
                </button>
                
                <button class="button" onclick="generateMCQs()">
                    Generate MCQs
                </button>
                
                <button class="button" onclick="generateProject()">
                    Generate Project
                </button>
                
                <button class="button" onclick="openTutorial()">
                    Open Tutorial
                </button>
                
                <div class="status" id="status">
                    Ready to help you understand code!
                </div>

                <script>
                    function explainLike5() {
                        vscode.postMessage({ command: 'explainLike5' });
                    }
                    
                    function learningMode() {
                        vscode.postMessage({ command: 'learningMode' });
                    }
                    
                    function interviewMode() {
                        vscode.postMessage({ command: 'interviewMode' });
                    }
                    
                    function generateMCQs() {
                        vscode.postMessage({ command: 'generateMCQs' });
                    }
                    
                    function generateProject() {
                        vscode.postMessage({ command: 'generateProject' });
                    }
                    
                    function openTutorial() {
                        vscode.postMessage({ command: 'openTutorial' });
                    }
                    
                    // Get the VS Code API
                    const vscode = acquireVsCodeApi();
                </script>
            </body>
            </html>
        `;
    }

    private setupMessageHandlers(): void {
        if (!this.panel) return;

        this.panel.webview.onDidReceiveMessage(async (message) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found. Please select some code first.');
                return;
            }

            const selection = editor.selection;
            const text = editor.document.getText(selection);
            
            if (!text.trim()) {
                vscode.window.showErrorMessage('Please select some code to explain.');
                return;
            }

            try {
                let response;
                let title;

                switch (message.command) {
                    case 'explainLike5':
                        vscode.window.showInformationMessage('Generating explanation...');
                        response = await this.localAIService.explainLike5(text, editor.document.languageId);
                        title = 'Explain Like I\'m 5';
                        break;
                    case 'learningMode':
                        vscode.window.showInformationMessage('Generating learning steps...');
                        response = await this.localAIService.learningMode(text, editor.document.languageId);
                        title = 'Learning Mode';
                        break;
                    case 'interviewMode':
                        vscode.window.showInformationMessage('Generating interview analysis...');
                        response = await this.localAIService.interviewMode(text, editor.document.languageId);
                        title = 'Interview Mode';
                        break;
                    case 'generateMCQs':
                        vscode.window.showInformationMessage('Generating MCQs...');
                        response = await this.localAIService.generateMCQs(text, editor.document.languageId);
                        title = 'Multiple Choice Questions';
                        break;
                    case 'generateProject':
                        vscode.window.showInformationMessage('Generating project idea...');
                        response = await this.localAIService.generateProject(text, editor.document.languageId);
                        title = 'Project Idea';
                        break;
                    case 'openTutorial':
                        vscode.commands.executeCommand('knowcode.openTutorial');
                        return;
                    default:
                        return;
                }

                if (response.success) {
                    await this.showExplanation(response.content, title);
                } else {
                    vscode.window.showErrorMessage(`Failed to generate response: ${response.error}`);
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Error: ${error}`);
            }
        });
    }

    private async showExplanation(content: string, title: string) {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeExplanation',
            `KNOWCODE: ${title}`,
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.generateExplanationHTML(content, title);
    }

    private generateExplanationHTML(content: string, title: string): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE: ${title}</title>
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
                    .content {
                        background: var(--vscode-input-background);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 6px;
                        padding: 20px;
                        margin-bottom: 20px;
                    }
                    .content pre {
                        background: var(--vscode-textBlockQuote-background);
                        padding: 15px;
                        border-radius: 4px;
                        overflow-x: auto;
                        border-left: 4px solid var(--vscode-textLink-foreground);
                    }
                    .content code {
                        background: var(--vscode-textBlockQuote-background);
                        padding: 2px 4px;
                        border-radius: 3px;
                    }
                    .footer {
                        text-align: center;
                        color: var(--vscode-descriptionForeground);
                        font-size: 0.9em;
                    }
                    .json-content {
                        background: var(--vscode-textBlockQuote-background);
                        padding: 15px;
                        border-radius: 4px;
                        font-family: 'Monaco', 'Menlo', monospace;
                        white-space: pre-wrap;
                        overflow-x: auto;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${title}</h1>
                </div>
                <div class="content">
                    <div class="json-content">${content}</div>
                </div>
                <div class="footer">
                    Powered by KNOWCODE - Making code understandable for everyone
                </div>
            </body>
            </html>
        `;
    }
}
