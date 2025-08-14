import * as vscode from 'vscode';
import { LocalModelService } from './LocalModelService';
import { UnifiedAIService } from './UnifiedAIService';
import { APIKeyManager } from './APIKeyManager';
import { OverlayManager } from './OverlayManager';
import { AIEnhancer } from './AIEnhancer';

export class KNOWCODEPanel {
    private static instance: KNOWCODEPanel;
    private panel: vscode.WebviewPanel | undefined;
    private localModelService: LocalModelService;
    private unifiedAIService: UnifiedAIService;
    private overlayManager: OverlayManager;
    private aiEnhancer: AIEnhancer;

    private constructor() {
        this.localModelService = LocalModelService.getInstance();
        const apiKeyManager = APIKeyManager.getInstance();
        this.unifiedAIService = UnifiedAIService.getInstance(apiKeyManager);
        this.overlayManager = new OverlayManager();
        this.aiEnhancer = AIEnhancer.getInstance();
    }

    public static getInstance(): KNOWCODEPanel {
        if (!KNOWCODEPanel.instance) {
            KNOWCODEPanel.instance = new KNOWCODEPanel();
        }
        return KNOWCODEPanel.instance;
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
                    
                    .explanation {
                        margin-top: 20px;
                        padding: 15px;
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        border-radius: 4px;
                        font-size: 13px;
                        line-height: 1.4;
                    }
                    
                    .loading {
                        text-align: center;
                        color: var(--vscode-descriptionForeground);
                        font-style: italic;
                    }
                    
                    .error {
                        color: var(--vscode-errorForeground);
                        background-color: var(--vscode-inputValidation-errorBackground);
                        padding: 10px;
                        border-radius: 4px;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">🚀 KNOWCODE - AI Code Companion</div>
                
                <div style="margin-bottom: 15px; font-size: 12px; color: var(--vscode-descriptionForeground);">
                    💡 <strong>How to use:</strong><br>
                    1. Open a code file in the editor<br>
                    2. Select some code (or leave empty to analyze entire file)<br>
                    3. Click any button for instant AI magic!
                </div>
                
                <button class="button" onclick="explainLike5()">👶 Explain like I'm 5</button>
                <button class="button" onclick="generateProjectIdea()">💡 Generate Project Idea</button>
                <button class="button" onclick="addResumeBullet()">📄 Add Resume Bullet</button>
                <button class="button" onclick="generateAIComments()">💬 Generate AI Comments</button>
                <button class="button" onclick="stepByStepWalkthrough()">🔍 Step-by-Step Walkthrough</button>
                <button class="button" onclick="plainEnglishTranslation()">🗣️ Translate to Plain English</button>
                <button class="button" onclick="spotTheBug()">🐛 Spot the Bug</button>
                
                <div style="margin: 20px 0; border-top: 1px solid var(--vscode-panel-border); padding-top: 15px;">
                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">🎯 Advanced Features</div>
                </div>
                
                <button class="button" onclick="generateCodeStory()">📖 Turn Code into Story</button>
                <button class="button" onclick="generateCodeOptimization()">⚡ Performance Optimization</button>
                <button class="button" onclick="generateCodeChallenge()">🎮 Create Coding Challenge</button>
                <button class="button" onclick="generateCodeMeme()">😂 Generate Code Meme</button>
                <button class="button" onclick="generateCodePrediction()">🔮 Future Prediction</button>
                <button class="button" onclick="generateCodeTutorial()">📚 Create Tutorial</button>
                <button class="button" onclick="generateCodeQuiz()">❓ Interactive Quiz</button>
                <button class="button" onclick="generateCodePortfolio()">🎨 Portfolio Showcase</button>
                
                <div id="status" style="margin-top: 15px; padding: 10px; background-color: var(--vscode-editor-inactiveSelectionBackground); border-radius: 4px; font-size: 12px; color: var(--vscode-descriptionForeground);">
                    📄 <strong>Current File:</strong> <span id="currentFile">No file open</span><br>
                    📝 <strong>Selected Code:</strong> <span id="selectedCode">None</span><br>
                    <button onclick="updateStatus()" style="margin-top: 5px; padding: 5px 10px; background-color: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">🔄 Refresh Status</button>
                </div>
                
                <div id="explanation" class="explanation" style="display: none;"></div>
                
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function explainLike5() {
                        showLoading();
                        vscode.postMessage({
                            command: 'explainLike5'
                        });
                    }
                    
                    function generateProjectIdea() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateProjectIdea'
                        });
                    }
                    
                    function addResumeBullet() {
                        showLoading();
                        vscode.postMessage({
                            command: 'addResumeBullet'
                        });
                    }
                    
                    function generateAIComments() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateAIComments'
                        });
                    }
                    
                    function stepByStepWalkthrough() {
                        showLoading();
                        vscode.postMessage({
                            command: 'stepByStepWalkthrough'
                        });
                    }
                    
                    function plainEnglishTranslation() {
                        showLoading();
                        vscode.postMessage({
                            command: 'plainEnglishTranslation'
                        });
                    }
                    
                    function spotTheBug() {
                        showLoading();
                        vscode.postMessage({
                            command: 'spotTheBug'
                        });
                    }
                    
                    function generateCodeStory() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateCodeStory'
                        });
                    }
                    
                    function generateCodeOptimization() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateCodeOptimization'
                        });
                    }
                    
                    function generateCodeChallenge() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateCodeChallenge'
                        });
                    }
                    
                    function generateCodeMeme() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateCodeMeme'
                        });
                    }
                    
                    function generateCodePrediction() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateCodePrediction'
                        });
                    }
                    
                    function generateCodeTutorial() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateCodeTutorial'
                        });
                    }
                    
                    function generateCodeQuiz() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateCodeQuiz'
                        });
                    }
                    
                    function generateCodePortfolio() {
                        showLoading();
                        vscode.postMessage({
                            command: 'generateCodePortfolio'
                        });
                    }
                    
                    function updateStatus() {
                        vscode.postMessage({
                            command: 'updateStatus'
                        });
                    }
                    
                    function showLoading() {
                        const explanation = document.getElementById('explanation');
                        explanation.style.display = 'block';
                        explanation.innerHTML = '<div class="loading">Generating explanation...</div>';
                    }
                    
                    function showError(message) {
                        const explanation = document.getElementById('explanation');
                        explanation.style.display = 'block';
                        explanation.innerHTML = '<div class="error">Error: ' + message + '</div>';
                    }
                    
                    function showExplanation(content) {
                        const explanation = document.getElementById('explanation');
                        explanation.style.display = 'block';
                        explanation.innerHTML = content;
                    }
                    
                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'showExplanation':
                                showExplanation(message.content);
                                break;
                            case 'showError':
                                showError(message.error);
                                break;
                            case 'updateStatusDisplay':
                                document.getElementById('currentFile').textContent = message.fileName;
                                document.getElementById('selectedCode').textContent = message.selectedCode;
                                break;
                        }
                    });
                    
                    // Update status when page loads
                    updateStatus();
                </script>
            </body>
            </html>
        `;
    }

    private setupMessageHandlers(): void {
        if (!this.panel) return;

        this.panel.webview.onDidReceiveMessage(async (message) => {
            const editor = vscode.window.activeTextEditor;
            let text = '';
            let context = '';

            if (!editor) {
                // If no active editor, show a helpful message and suggest opening a file
                this.showError('No active editor found. Please open a code file first, then select some code and try again.');
                return;
            }

            const selection = editor.selection;
            text = editor.document.getText(selection);
            context = `Language: ${editor.document.languageId}, File: ${editor.document.fileName}`;
            
            if (!text.trim()) {
                // If no text is selected, get the entire file content
                text = editor.document.getText();
                if (!text.trim()) {
                    this.showError('No code found. Please add some code to the file or select specific code to explain.');
                    return;
                }
                // If using entire file, limit it to first 500 characters for performance
                if (text.length > 500) {
                    text = text.substring(0, 500) + '\n\n... (showing first 500 characters)';
                }
            }

            context = `Language: ${editor.document.languageId}, File: ${editor.document.fileName}`;

            try {
                let response;
                let content = '';

                switch (message.command) {
                    case 'explainLike5':
                        response = await this.unifiedAIService.generateExplainLike5(text, context);
                        break;

                    case 'generateProjectIdea':
                        response = await this.localModelService.generateProjectIdea(text, context);
                        if (response.success) {
                            content = this.formatExplanation(response.content, 'Project Idea');
                        } else {
                            this.showError(response.error || 'Failed to generate project idea');
                            return;
                        }
                        break;

                    case 'addResumeBullet':
                        response = await this.localModelService.generateInterviewExplanation(text, context);
                        if (response.success) {
                            content = this.formatExplanation(response.content, 'Resume Bullet');
                        } else {
                            this.showError(response.error || 'Failed to generate resume bullet');
                            return;
                        }
                        break;

                    case 'generateAIComments':
                        response = await this.localModelService.generateExplanation(text, context, 'comments');
                        if (response.success) {
                            content = this.formatExplanation(response.content, 'AI Comments');
                        } else {
                            this.showError(response.error || 'Failed to generate AI comments');
                            return;
                        }
                        break;

                    case 'stepByStepWalkthrough':
                        response = await this.localModelService.generateStepByStepWalkthrough(text, context);
                        if (response.success) {
                            content = this.formatExplanation(response.content, 'Step-by-Step Walkthrough');
                        } else {
                            this.showError(response.error || 'Failed to generate walkthrough');
                            return;
                        }
                        break;

                    case 'plainEnglishTranslation':
                        response = await this.localModelService.generatePlainEnglishTranslation(text, context);
                        if (response.success) {
                            content = this.formatExplanation(response.content, 'Plain English Translation');
                        } else {
                            this.showError(response.error || 'Failed to generate translation');
                            return;
                        }
                        break;

                    case 'spotTheBug':
                        response = await this.localModelService.generateDebugInsight(text, context);
                        if (response.success) {
                            content = this.formatExplanation(response.content, 'Bug Analysis');
                        } else {
                            this.showError(response.error || 'Failed to analyze bugs');
                            return;
                        }
                        break;

                    case 'generateCodeStory':
                        const story = await this.aiEnhancer.generateCodeStory(text, context);
                        content = this.formatExplanation(story, 'Code Story');
                        break;

                    case 'generateCodeOptimization':
                        const optimization = await this.aiEnhancer.generateCodeOptimization(text, context);
                        content = this.formatExplanation(optimization, 'Performance Optimization');
                        break;

                    case 'generateCodeChallenge':
                        const challenge = await this.aiEnhancer.generateCodeChallenge(text, context);
                        content = this.formatExplanation(challenge, 'Coding Challenge');
                        break;

                    case 'generateCodeMeme':
                        const meme = await this.aiEnhancer.generateCodeMeme(text, context);
                        content = this.formatExplanation(meme, 'Code Meme');
                        break;

                    case 'generateCodePrediction':
                        const prediction = await this.aiEnhancer.generateCodePrediction(text, context);
                        content = this.formatExplanation(prediction, 'Future Prediction');
                        break;

                    case 'generateCodeTutorial':
                        const tutorial = await this.aiEnhancer.generateCodeTutorial(text, context);
                        content = this.formatExplanation(tutorial, 'Code Tutorial');
                        break;

                    case 'generateCodeQuiz':
                        const quiz = await this.aiEnhancer.generateCodeQuiz(text, context);
                        content = this.formatExplanation(quiz, 'Interactive Quiz');
                        break;

                    case 'generateCodePortfolio':
                        const portfolio = await this.aiEnhancer.generateCodePortfolio(text, context);
                        content = this.formatExplanation(portfolio, 'Portfolio Showcase');
                        break;

                    case 'updateStatus':
                        this.updateStatus();
                        return;

                    default:
                        this.showError('Unknown command');
                        return;
                }

                this.showExplanation(content);
            } catch (error) {
                this.showError(error instanceof Error ? error.message : 'Unknown error');
            }
        });
    }

    private formatExplanation(content: string, title: string): string {
        return `
            <h3>${title}</h3>
            <div style="white-space: pre-wrap;">${content}</div>
        `;
    }

    private showExplanation(content: string): void {
        if (this.panel) {
            this.panel.webview.postMessage({
                command: 'showExplanation',
                content: content
            });
        }
    }

    private showError(error: string): void {
        if (this.panel) {
            this.panel.webview.postMessage({
                command: 'showError',
                error: error
            });
        }
    }

    private updateStatus(): void {
        if (!this.panel) return;

        const editor = vscode.window.activeTextEditor;
        let fileName = 'No file open';
        let selectedCode = 'None';

        if (editor) {
            fileName = editor.document.fileName.split('/').pop() || 'Unknown file';
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            
            if (text.trim()) {
                selectedCode = `${text.length} characters selected`;
            } else {
                const fullText = editor.document.getText();
                if (fullText.trim()) {
                    selectedCode = `Entire file (${fullText.length} characters)`;
                } else {
                    selectedCode = 'Empty file';
                }
            }
        }

        this.panel.webview.postMessage({
            command: 'updateStatusDisplay',
            fileName: fileName,
            selectedCode: selectedCode
        });
    }

    public dispose(): void {
        if (this.panel) {
            this.panel.dispose();
            this.panel = undefined;
        }
    }
}
