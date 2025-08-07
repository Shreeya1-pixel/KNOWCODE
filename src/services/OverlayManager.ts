import * as vscode from 'vscode';
import { CodeExplanation } from './CodeExplainer';
import { AIComment } from './EnhancedExplainer';
import { MCQ, ProjectIdea } from './LearningMode';

export interface Diagram {
    type: 'flowchart' | 'sequenceDiagram' | 'classDiagram' | 'mermaid';
    content: string;
    title: string;
}

export class OverlayManager {
    private overlayMode: boolean = false;
    private activeDecorations: vscode.TextEditorDecorationType[] = [];
    private activePanels: vscode.WebviewPanel[] = [];
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.text = 'KNOWCODE';
        this.statusBarItem.tooltip = 'KNOWCODE Interactive Learning';
        this.statusBarItem.command = 'knowcode.toggleOverlay';
        this.statusBarItem.show();
    }

    async showExplanation(explanation: CodeExplanation, range: vscode.Range): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        // Clear existing decorations
        this.clearDecorations();

        // Create decoration for the explained code
        const decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
            border: '2px solid',
            borderColor: new vscode.ThemeColor('editor.findMatchBorder'),
            after: {
                contentText: ' 💡',
                color: new vscode.ThemeColor('editorInfo.foreground')
            }
        });

        editor.setDecorations(decorationType, [range]);
        this.activeDecorations.push(decorationType);

        // Show explanation in a webview panel
        await this.showExplanationPanel(explanation, range);
    }

    async showEnhancedExplanation(explanation: string, range: vscode.Range, modeId: string): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        // Clear existing decorations
        this.clearDecorations();

        // Create decoration for the explained code
        const decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
            border: '2px solid',
            borderColor: new vscode.ThemeColor('editor.findMatchBorder'),
            after: {
                contentText: ' 🎯',
                color: new vscode.ThemeColor('editorInfo.foreground')
            }
        });

        editor.setDecorations(decorationType, [range]);
        this.activeDecorations.push(decorationType);

        // Show enhanced explanation in a webview panel
        await this.showEnhancedExplanationPanel(explanation, range, modeId);
    }

    async showMCQs(mcqs: MCQ[], documentUri: vscode.Uri): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeMCQs',
            'KNOWCODE MCQs',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        const html = this.generateMCQsHTML(mcqs);
        panel.webview.html = html;

        this.activePanels.push(panel);

        panel.onDidDispose(() => {
            const index = this.activePanels.indexOf(panel);
            if (index > -1) {
                this.activePanels.splice(index, 1);
            }
        });
    }

    async showProjectIdeas(ideas: ProjectIdea[]): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeProjectIdeas',
            'KNOWCODE Project Ideas',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        const html = this.generateProjectIdeasHTML(ideas);
        panel.webview.html = html;

        this.activePanels.push(panel);

        panel.onDidDispose(() => {
            const index = this.activePanels.indexOf(panel);
            if (index > -1) {
                this.activePanels.splice(index, 1);
            }
        });
    }

    async showBoilerplate(boilerplate: any, projectName: string): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeBoilerplate',
            'KNOWCODE Boilerplate',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        const html = this.generateBoilerplateHTML(boilerplate, projectName);
        panel.webview.html = html;

        this.activePanels.push(panel);

        panel.onDidDispose(() => {
            const index = this.activePanels.indexOf(panel);
            if (index > -1) {
                this.activePanels.splice(index, 1);
            }
        });
    }

    async showAIComments(comments: AIComment[], documentUri: vscode.Uri): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeAIComments',
            'KNOWCODE AI Comments',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        const html = this.generateAICommentsHTML(comments);
        panel.webview.html = html;

        this.activePanels.push(panel);

        panel.onDidDispose(() => {
            const index = this.activePanels.indexOf(panel);
            if (index > -1) {
                this.activePanels.splice(index, 1);
            }
        });
    }

    async showResumeBullet(resumeBullet: string, timeComplexity: string, optimizationTips: string[], range: vscode.Range): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        // Clear existing decorations
        this.clearDecorations();

        // Create decoration for the resume bullet code
        const decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
            border: '2px solid',
            borderColor: new vscode.ThemeColor('editor.findMatchBorder'),
            after: {
                contentText: ' 💼',
                color: new vscode.ThemeColor('editorInfo.foreground')
            }
        });

        editor.setDecorations(decorationType, [range]);
        this.activeDecorations.push(decorationType);

        // Show resume bullet in a webview panel
        await this.showResumeBulletPanel(resumeBullet, timeComplexity, optimizationTips, range);
    }

    async showDiagram(diagram: Diagram, range: vscode.Range): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        // Clear existing decorations
        this.clearDecorations();

        // Create decoration for the diagrammed code
        const decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
            border: '2px solid',
            borderColor: new vscode.ThemeColor('editor.findMatchBorder'),
            after: {
                contentText: ' 📊',
                color: new vscode.ThemeColor('editorInfo.foreground')
            }
        });

        editor.setDecorations(decorationType, [range]);
        this.activeDecorations.push(decorationType);

        // Show diagram in a webview panel
        await this.showDiagramPanel(diagram, range);
    }

    toggleOverlayMode(): void {
        this.overlayMode = !this.overlayMode;
        
        if (this.overlayMode) {
            this.statusBarItem.text = 'KNOWCODE $(eye)';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            vscode.window.showInformationMessage('KNOWCODE overlay mode enabled');
        } else {
            this.statusBarItem.text = 'KNOWCODE';
            this.statusBarItem.backgroundColor = undefined;
            this.clearAll();
            vscode.window.showInformationMessage('KNOWCODE overlay mode disabled');
        }
    }

    private async showExplanationPanel(explanation: CodeExplanation, range: vscode.Range): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeExplanation',
            'KNOWCODE Explanation',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        const html = this.generateExplanationHTML(explanation, range);
        panel.webview.html = html;

        this.activePanels.push(panel);

        panel.onDidDispose(() => {
            const index = this.activePanels.indexOf(panel);
            if (index > -1) {
                this.activePanels.splice(index, 1);
            }
        });
    }

    private async showEnhancedExplanationPanel(explanation: string, range: vscode.Range, modeId: string): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeEnhancedExplanation',
            'KNOWCODE Enhanced Explanation',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        const html = this.generateEnhancedExplanationHTML(explanation, range, modeId);
        panel.webview.html = html;

        this.activePanels.push(panel);

        panel.onDidDispose(() => {
            const index = this.activePanels.indexOf(panel);
            if (index > -1) {
                this.activePanels.splice(index, 1);
            }
        });
    }

    private async showResumeBulletPanel(resumeBullet: string, timeComplexity: string, optimizationTips: string[], range: vscode.Range): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeResumeBullet',
            'KNOWCODE Resume Bullet',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        const html = this.generateResumeBulletHTML(resumeBullet, timeComplexity, optimizationTips, range);
        panel.webview.html = html;

        this.activePanels.push(panel);

        panel.onDidDispose(() => {
            const index = this.activePanels.indexOf(panel);
            if (index > -1) {
                this.activePanels.splice(index, 1);
            }
        });
    }

    private async showDiagramPanel(diagram: Diagram, range: vscode.Range): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'knowcodeDiagram',
            'KNOWCODE Diagram',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        const html = this.generateDiagramHTML(diagram, range);
        panel.webview.html = html;

        this.activePanels.push(panel);

        panel.onDidDispose(() => {
            const index = this.activePanels.indexOf(panel);
            if (index > -1) {
                this.activePanels.splice(index, 1);
            }
        });
    }

    private generateExplanationHTML(explanation: CodeExplanation, range: vscode.Range): string {
        const complexityColor = {
            simple: '#4CAF50',
            moderate: '#FF9800',
            complex: '#F44336'
        };

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE Explanation</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .logo {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .complexity-badge {
                        margin-left: auto;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: 500;
                        text-transform: uppercase;
                        background-color: ${complexityColor[explanation.complexity]};
                        color: white;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                    .section-title {
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 8px;
                        color: var(--vscode-editor-foreground);
                    }
                    .summary {
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        padding: 12px;
                        border-radius: 6px;
                        border-left: 4px solid var(--vscode-editorInfo-border);
                    }
                    .details {
                        line-height: 1.6;
                        white-space: pre-wrap;
                    }
                    .concepts {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 6px;
                    }
                    .concept-tag {
                        background-color: var(--vscode-badge-background);
                        color: var(--vscode-badge-foreground);
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                    }
                    .examples {
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        padding: 12px;
                        border-radius: 6px;
                        border-left: 4px solid var(--vscode-editorWarning-border);
                    }
                    .example-item {
                        margin-bottom: 8px;
                        font-family: 'Monaco', 'Menlo', monospace;
                        background-color: var(--vscode-editor-background);
                        padding: 4px 8px;
                        border-radius: 4px;
                    }
                    .range-info {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 1px solid var(--vscode-panel-border);
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">💡</div>
                    <div class="title">Code Explanation</div>
                    <div class="complexity-badge">${explanation.complexity}</div>
                </div>

                <div class="section">
                    <div class="section-title">Summary</div>
                    <div class="summary">${explanation.summary}</div>
                </div>

                <div class="section">
                    <div class="section-title">Detailed Explanation</div>
                    <div class="details">${explanation.details}</div>
                </div>

                <div class="section">
                    <div class="section-title">Key Concepts</div>
                    <div class="concepts">
                        ${explanation.concepts.map(concept => 
                            `<span class="concept-tag">${concept}</span>`
                        ).join('')}
                    </div>
                </div>

                ${explanation.examples && explanation.examples.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Usage Examples</div>
                        <div class="examples">
                            ${explanation.examples.map(example => 
                                `<div class="example-item">${example}</div>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="range-info">
                    Explaining code at lines ${range.start.line + 1}-${range.end.line + 1}
                </div>
            </body>
            </html>
        `;
    }

    private generateEnhancedExplanationHTML(explanation: string, range: vscode.Range, modeId: string): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE Enhanced Explanation</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .logo {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .mode-badge {
                        margin-left: auto;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: 500;
                        background-color: var(--vscode-badge-background);
                        color: var(--vscode-badge-foreground);
                    }
                    .explanation {
                        line-height: 1.6;
                        white-space: pre-wrap;
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        padding: 16px;
                        border-radius: 8px;
                        border-left: 4px solid var(--vscode-editorInfo-border);
                    }
                    .range-info {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 1px solid var(--vscode-panel-border);
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">🎯</div>
                    <div class="title">Enhanced Explanation</div>
                    <div class="mode-badge">${modeId}</div>
                </div>

                <div class="explanation">${explanation}</div>

                <div class="range-info">
                    Explaining code at lines ${range.start.line + 1}-${range.end.line + 1}
                </div>
            </body>
            </html>
        `;
    }

    private generateMCQsHTML(mcqs: MCQ[]): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE MCQs</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .logo {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .mcq {
                        margin-bottom: 24px;
                        padding: 16px;
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 8px;
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                    }
                    .question {
                        font-weight: 600;
                        margin-bottom: 12px;
                        color: var(--vscode-editor-foreground);
                    }
                    .options {
                        margin-bottom: 12px;
                    }
                    .option {
                        padding: 8px 12px;
                        margin: 4px 0;
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    .option:hover {
                        background-color: var(--vscode-list-hoverBackground);
                    }
                    .option.correct {
                        background-color: #4CAF50;
                        color: white;
                        border-color: #4CAF50;
                    }
                    .option.incorrect {
                        background-color: #F44336;
                        color: white;
                        border-color: #F44336;
                    }
                    .explanation {
                        margin-top: 12px;
                        padding: 12px;
                        background-color: var(--vscode-editor-background);
                        border-radius: 4px;
                        border-left: 4px solid var(--vscode-editorInfo-border);
                        display: none;
                    }
                    .category {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                        margin-bottom: 8px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">📚</div>
                    <div class="title">Multiple Choice Questions</div>
                </div>

                ${mcqs.map((mcq, index) => `
                    <div class="mcq">
                        <div class="category">${mcq.category}</div>
                        <div class="question">${index + 1}. ${mcq.question}</div>
                        <div class="options">
                            ${mcq.options.map((option, optionIndex) => `
                                <div class="option" onclick="checkAnswer(${index}, ${optionIndex}, ${mcq.correctAnswer})">
                                    ${String.fromCharCode(65 + optionIndex)}. ${option}
                                </div>
                            `).join('')}
                        </div>
                        <div class="explanation" id="explanation-${index}">
                            <strong>Explanation:</strong> ${mcq.explanation}
                        </div>
                    </div>
                `).join('')}

                <script>
                    function checkAnswer(mcqIndex, selectedOption, correctAnswer) {
                        const options = document.querySelectorAll(\`.mcq:nth-child(\${mcqIndex + 2}) .option\`);
                        const explanation = document.getElementById(\`explanation-\${mcqIndex}\`);
                        
                        options.forEach((option, index) => {
                            option.classList.remove('correct', 'incorrect');
                            if (index === correctAnswer) {
                                option.classList.add('correct');
                            } else if (index === selectedOption) {
                                option.classList.add('incorrect');
                            }
                        });
                        
                        explanation.style.display = 'block';
                    }
                </script>
            </body>
            </html>
        `;
    }

    private generateProjectIdeasHTML(ideas: ProjectIdea[]): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE Project Ideas</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .logo {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .idea {
                        margin-bottom: 24px;
                        padding: 16px;
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 8px;
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                    }
                    .idea-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 8px;
                        color: var(--vscode-editor-foreground);
                    }
                    .difficulty {
                        display: inline-block;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                        margin-bottom: 8px;
                    }
                    .difficulty.beginner {
                        background-color: #4CAF50;
                        color: white;
                    }
                    .difficulty.intermediate {
                        background-color: #FF9800;
                        color: white;
                    }
                    .difficulty.advanced {
                        background-color: #F44336;
                        color: white;
                    }
                    .description {
                        margin-bottom: 12px;
                        line-height: 1.5;
                    }
                    .technologies {
                        margin-bottom: 12px;
                    }
                    .tech-tag {
                        display: inline-block;
                        background-color: var(--vscode-badge-background);
                        color: var(--vscode-badge-foreground);
                        padding: 2px 6px;
                        border-radius: 8px;
                        font-size: 11px;
                        margin: 2px;
                    }
                    .section {
                        margin-bottom: 12px;
                    }
                    .section-title {
                        font-weight: 600;
                        margin-bottom: 4px;
                        color: var(--vscode-editor-foreground);
                    }
                    .list {
                        margin: 0;
                        padding-left: 20px;
                    }
                    .list li {
                        margin-bottom: 2px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">💡</div>
                    <div class="title">Project Ideas</div>
                </div>

                ${ideas.map(idea => `
                    <div class="idea">
                        <div class="idea-title">${idea.title}</div>
                        <div class="difficulty ${idea.difficulty}">${idea.difficulty}</div>
                        <div class="description">${idea.description}</div>
                        
                        <div class="technologies">
                            ${idea.technologies.map(tech => `
                                <span class="tech-tag">${tech}</span>
                            `).join('')}
                        </div>
                        
                        <div class="section">
                            <div class="section-title">Learning Outcomes:</div>
                            <ul class="list">
                                ${idea.learningOutcomes.map(outcome => `
                                    <li>${outcome}</li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="section">
                            <div class="section-title">Resources:</div>
                            <ul class="list">
                                ${idea.resources.map(resource => `
                                    <li>${resource}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;
    }

    private generateBoilerplateHTML(boilerplate: any, projectName: string): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE Boilerplate</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .logo {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                    .section-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 12px;
                        color: var(--vscode-editor-foreground);
                    }
                    .structure {
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        padding: 12px;
                        border-radius: 6px;
                        font-family: 'Monaco', 'Menlo', monospace;
                        font-size: 12px;
                    }
                    .file-item {
                        margin: 2px 0;
                        padding: 2px 0;
                    }
                    .folder {
                        color: var(--vscode-symbolIcon-folderForeground);
                    }
                    .file {
                        color: var(--vscode-symbolIcon-fileForeground);
                    }
                    .code-block {
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        padding: 12px;
                        border-radius: 6px;
                        font-family: 'Monaco', 'Menlo', monospace;
                        font-size: 12px;
                        white-space: pre-wrap;
                        overflow-x: auto;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">📁</div>
                    <div class="title">Boilerplate for ${projectName}</div>
                </div>

                <div class="section">
                    <div class="section-title">Project Structure</div>
                    <div class="structure">
                        ${boilerplate.structure.map((item: string) => `
                            <div class="file-item ${item.endsWith('/') ? 'folder' : 'file'}">${item}</div>
                        `).join('')}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">README.md</div>
                    <div class="code-block">${boilerplate.readme}</div>
                </div>

                <div class="section">
                    <div class="section-title">package.json</div>
                    <div class="code-block">${JSON.stringify(boilerplate.packageJson, null, 2)}</div>
                </div>
            </body>
            </html>
        `;
    }

    private generateAICommentsHTML(comments: AIComment[]): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE AI Comments</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .logo {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .comment {
                        margin-bottom: 16px;
                        padding: 12px;
                        border-radius: 6px;
                        border-left: 4px solid;
                    }
                    .comment.explanation {
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        border-left-color: var(--vscode-editorInfo-border);
                    }
                    .comment.warning {
                        background-color: #fff3cd;
                        border-left-color: #ffc107;
                        color: #856404;
                    }
                    .comment.tip {
                        background-color: #d1ecf1;
                        border-left-color: #17a2b8;
                        color: #0c5460;
                    }
                    .comment.question {
                        background-color: #f8d7da;
                        border-left-color: #dc3545;
                        color: #721c24;
                    }
                    .line-number {
                        font-weight: 600;
                        margin-bottom: 4px;
                        font-size: 12px;
                        opacity: 0.8;
                    }
                    .comment-text {
                        line-height: 1.4;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">🤖</div>
                    <div class="title">AI Comments</div>
                </div>

                ${comments.map(comment => `
                    <div class="comment ${comment.type}">
                        <div class="line-number">Line ${comment.line}</div>
                        <div class="comment-text">${comment.comment}</div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;
    }

    private generateResumeBulletHTML(resumeBullet: string, timeComplexity: string, optimizationTips: string[], range: vscode.Range): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE Resume Bullet</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .logo {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                    .section-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 12px;
                        color: var(--vscode-editor-foreground);
                    }
                    .resume-bullet {
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        padding: 16px;
                        border-radius: 6px;
                        border-left: 4px solid var(--vscode-editorInfo-border);
                        font-size: 14px;
                        line-height: 1.5;
                    }
                    .complexity {
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        padding: 12px;
                        border-radius: 6px;
                        border-left: 4px solid var(--vscode-editorWarning-border);
                        font-family: 'Monaco', 'Menlo', monospace;
                        font-size: 12px;
                    }
                    .tips {
                        background-color: var(--vscode-editor-inactiveSelectionBackground);
                        padding: 12px;
                        border-radius: 6px;
                        border-left: 4px solid var(--vscode-editorError-border);
                    }
                    .tip {
                        margin: 4px 0;
                        padding: 4px 0;
                    }
                    .range-info {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 1px solid var(--vscode-panel-border);
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">💼</div>
                    <div class="title">Resume Bullet</div>
                </div>

                <div class="section">
                    <div class="section-title">Resume Bullet Point</div>
                    <div class="resume-bullet">${resumeBullet}</div>
                </div>

                <div class="section">
                    <div class="section-title">Time Complexity</div>
                    <div class="complexity">${timeComplexity}</div>
                </div>

                <div class="section">
                    <div class="section-title">Optimization Tips</div>
                    <div class="tips">
                        ${optimizationTips.map(tip => `
                            <div class="tip">• ${tip}</div>
                        `).join('')}
                    </div>
                </div>

                <div class="range-info">
                    Generated from code at lines ${range.start.line + 1}-${range.end.line + 1}
                </div>
            </body>
            </html>
        `;
    }

    private generateDiagramHTML(diagram: Diagram, range: vscode.Range): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KNOWCODE Diagram</title>
                <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .logo {
                        font-size: 24px;
                        margin-right: 10px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .diagram-container {
                        background-color: white;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    .range-info {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 1px solid var(--vscode-panel-border);
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">📊</div>
                    <div class="title">${diagram.title}</div>
                </div>

                <div class="diagram-container">
                    <div class="mermaid">
                        ${diagram.content}
                    </div>
                </div>

                <div class="range-info">
                    Diagram for code at lines ${range.start.line + 1}-${range.end.line + 1}
                </div>

                <script>
                    mermaid.initialize({
                        startOnLoad: true,
                        theme: 'default',
                        flowchart: {
                            useMaxWidth: true,
                            htmlLabels: true
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }

    private clearDecorations(): void {
        this.activeDecorations.forEach(decoration => {
            decoration.dispose();
        });
        this.activeDecorations = [];
    }

    private clearAll(): void {
        this.clearDecorations();
        this.activePanels.forEach(panel => {
            panel.dispose();
        });
        this.activePanels = [];
    }

    dispose(): void {
        this.clearAll();
        this.statusBarItem.dispose();
    }
} 