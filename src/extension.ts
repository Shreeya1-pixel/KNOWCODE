import * as vscode from 'vscode';
import { LocalAIService } from './services/LocalAIService';
import { KNOWCODEPanel } from './services/KNOWCODEPanel';
import { TutorialPanel } from './services/TutorialPanel';
import { SetupManager } from './services/SetupManager';

let localAIService: LocalAIService;
let knowcodePanel: KNOWCODEPanel;
let tutorialPanel: TutorialPanel;
let setupManager: SetupManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('KNOWCODE extension is now active!');

    // Initialize services
    localAIService = new LocalAIService();
    knowcodePanel = new KNOWCODEPanel(context, localAIService);
    tutorialPanel = new TutorialPanel(context);
    setupManager = new SetupManager(context);

    // Check and setup Ollama automatically
    setupManager.checkAndSetupOllama().then(success => {
        if (success) {
            vscode.window.showInformationMessage('KNOWCODE is ready! Press Ctrl+Shift+P (Cmd+Shift+P on Mac) and type "KNOWCODE" to get started.');
        }
    });

    // Register commands
    const explainLike5 = vscode.commands.registerCommand('knowcode.explainLike5', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Please select some code first.');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showInformationMessage('💡 Tip: Select 5-20 lines of code for the best explanations! Too much code can be overwhelming, too little might not provide enough context.');
            vscode.window.showErrorMessage('Please select some code to explain.');
            return;
        }

        try {
            vscode.window.showInformationMessage('Generating explanation...');
            const response = await localAIService.explainLike5(text, editor.document.languageId);
            
            if (response.success) {
                await showExplanation(response.content, 'Explain Like I\'m 5');
            } else {
                if (response.error?.includes('Failed to call Ollama')) {
                    // Offer to setup Ollama if it's not available
                    const setupChoice = await vscode.window.showErrorMessage(
                        'Ollama is not available. Would you like to install it now?',
                        'Install Ollama',
                        'Manual Setup',
                        'Cancel'
                    );
                    
                    if (setupChoice === 'Install Ollama') {
                        await setupManager.checkAndSetupOllama();
                    } else if (setupChoice === 'Manual Setup') {
                        tutorialPanel.createPanel();
                    }
                } else {
                    vscode.window.showErrorMessage(`Failed to generate explanation: ${response.error}`);
                }
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    const learningMode = vscode.commands.registerCommand('knowcode.learningMode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Please select some code first.');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showInformationMessage('💡 Tip: Select 5-20 lines of code for the best explanations! Too much code can be overwhelming, too little might not provide enough context.');
            vscode.window.showErrorMessage('Please select some code to explain.');
            return;
        }

        try {
            vscode.window.showInformationMessage('Generating learning steps...');
            const response = await localAIService.learningMode(text, editor.document.languageId);
            
            if (response.success) {
                await showExplanation(response.content, 'Learning Mode');
            } else {
                vscode.window.showErrorMessage(`Failed to generate learning steps: ${response.error}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    const interviewMode = vscode.commands.registerCommand('knowcode.interviewMode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Please select some code first.');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showInformationMessage('💡 Tip: Select 5-20 lines of code for the best explanations! Too much code can be overwhelming, too little might not provide enough context.');
            vscode.window.showErrorMessage('Please select some code to explain.');
            return;
        }

        try {
            vscode.window.showInformationMessage('Generating interview analysis...');
            const response = await localAIService.interviewMode(text, editor.document.languageId);
            
            if (response.success) {
                await showExplanation(response.content, 'Interview Mode');
            } else {
                vscode.window.showErrorMessage(`Failed to generate analysis: ${response.error}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    const generateMCQs = vscode.commands.registerCommand('knowcode.generateMCQs', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Please select some code first.');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showErrorMessage('Please select some code to generate questions for.');
            return;
        }

        try {
            vscode.window.showInformationMessage('Generating MCQs...');
            const response = await localAIService.generateMCQs(text, editor.document.languageId);
            
            if (response.success) {
                await showExplanation(response.content, 'Multiple Choice Questions');
            } else {
                vscode.window.showErrorMessage(`Failed to generate MCQs: ${response.error}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    const generateProject = vscode.commands.registerCommand('knowcode.generateProject', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Please select some code first.');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showErrorMessage('Please select some code to generate a project from.');
            return;
        }

        try {
            vscode.window.showInformationMessage('Generating project idea...');
            const response = await localAIService.generateProject(text, editor.document.languageId);
            
            if (response.success) {
                await showExplanation(response.content, 'Project Idea');
            } else {
                vscode.window.showErrorMessage(`Failed to generate project: ${response.error}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    const openTutorial = vscode.commands.registerCommand('knowcode.openTutorial', () => {
        tutorialPanel.createPanel();
    });

    const openPanel = vscode.commands.registerCommand('knowcode.openPanel', () => {
        knowcodePanel.createPanel();
    });

    const setupOllama = vscode.commands.registerCommand('knowcode.setupOllama', async () => {
        const success = await setupManager.checkAndSetupOllama();
        if (success) {
            vscode.window.showInformationMessage('Ollama setup completed successfully! KNOWCODE is ready to use.');
        }
    });

    // Add commands to context
    context.subscriptions.push(
        explainLike5,
        learningMode,
        interviewMode,
        generateMCQs,
        generateProject,
        openTutorial,
        openPanel,
        setupOllama
    );

    // Show welcome message
    vscode.window.showInformationMessage('KNOWCODE is ready! Press Ctrl+Shift+P (Cmd+Shift+P on Mac) and type "KNOWCODE" to get started.');
}

async function showExplanation(content: string, title: string) {
    const panel = vscode.window.createWebviewPanel(
        'knowcodeExplanation',
        `KNOWCODE: ${title}`,
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = generateExplanationHTML(content, title);
}

function generateExplanationHTML(content: string, title: string): string {
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

export function deactivate() {
    console.log('KNOWCODE extension deactivated');
} 