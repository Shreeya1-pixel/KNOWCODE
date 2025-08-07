import * as vscode from 'vscode';
import { CodeExplainer } from './services/CodeExplainer';
import { OverlayManager } from './services/OverlayManager';
import { DiagramGenerator } from './services/DiagramGenerator';
import { ContextAnalyzer } from './services/ContextAnalyzer';
import { EnhancedExplainer } from './services/EnhancedExplainer';
import { LearningMode } from './services/LearningMode';

export function activate(context: vscode.ExtensionContext) {
    console.log('KNOWCODE extension is now active!');
    vscode.window.showInformationMessage('KNOWCODE extension is now active! 🎉');

    // Initialize services
    const codeExplainer = new CodeExplainer();
    const overlayManager = new OverlayManager();
    const diagramGenerator = new DiagramGenerator();
    const contextAnalyzer = new ContextAnalyzer();
    const enhancedExplainer = new EnhancedExplainer();
    const learningMode = new LearningMode();

    // Register commands
    const explainSelection = vscode.commands.registerCommand('knowcode.explainSelection', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showInformationMessage('Please select some code to explain');
            return;
        }

        try {
            const explanation = await codeExplainer.explainCode(text, editor.document.languageId);
            await overlayManager.showExplanation(explanation, selection);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to explain code: ${error}`);
        }
    });

    const explainFunction = vscode.commands.registerCommand('knowcode.explainFunction', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const position = editor.selection.active;
        const functionRange = await contextAnalyzer.findFunctionAtPosition(editor.document, position);
        
        if (!functionRange) {
            vscode.window.showInformationMessage('No function found at current position');
            return;
        }

        const functionText = editor.document.getText(functionRange);
        const explanation = await codeExplainer.explainFunction(functionText, editor.document.languageId);
        await overlayManager.showExplanation(explanation, functionRange);
    });

    const explainVariable = vscode.commands.registerCommand('knowcode.explainVariable', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const position = editor.selection.active;
        const variableRange = await contextAnalyzer.findVariableAtPosition(editor.document, position);
        
        if (!variableRange) {
            vscode.window.showInformationMessage('No variable found at current position');
            return;
        }

        const variableText = editor.document.getText(variableRange);
        const explanation = await codeExplainer.explainVariable(variableText, editor.document.languageId);
        await overlayManager.showExplanation(explanation, variableRange);
    });

    const showDiagram = vscode.commands.registerCommand('knowcode.showDiagram', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showInformationMessage('Please select some code to diagram');
            return;
        }

        try {
            const diagram = await diagramGenerator.generateDiagram(text, editor.document.languageId);
            await overlayManager.showDiagram(diagram, selection);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to generate diagram: ${error}`);
        }
    });

    const toggleOverlay = vscode.commands.registerCommand('knowcode.toggleOverlay', () => {
        overlayManager.toggleOverlayMode();
    });

    // Enhanced explanation commands
    const explainWithMode = vscode.commands.registerCommand('knowcode.explainWithMode', async (modeId?: string) => {
        console.log('KNOWCODE: explainWithMode command triggered');
        vscode.window.showInformationMessage('KNOWCODE: explainWithMode command triggered');
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showInformationMessage('Please select some code to explain');
            return;
        }

        // If no mode specified, show mode selection
        if (!modeId) {
            const modes = enhancedExplainer.getExplanationModes();
            const modeItems = modes.map(mode => ({
                label: `${mode.icon} ${mode.label}`,
                description: mode.description,
                modeId: mode.id
            }));

            const selectedMode = await vscode.window.showQuickPick(modeItems, {
                placeHolder: 'Choose explanation mode'
            });

            if (!selectedMode) return;
            modeId = selectedMode.modeId;
        }

        try {
            const explanation = enhancedExplainer.generateExplanation(text, editor.document.languageId, modeId);
            await overlayManager.showEnhancedExplanation(explanation, selection, modeId);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to explain code: ${error}`);
        }
    });

    const toggleLearningMode = vscode.commands.registerCommand('knowcode.toggleLearningMode', () => {
        console.log('KNOWCODE: toggleLearningMode command triggered');
        vscode.window.showInformationMessage('KNOWCODE: toggleLearningMode command triggered');
        
        const isEnabled = learningMode.toggleLearningMode();
        if (isEnabled) {
            vscode.window.showInformationMessage('🎓 Learning Mode Enabled! Use KNOWCODE commands to explore educational features.');
        }
    });

    const generateMCQs = vscode.commands.registerCommand('knowcode.generateMCQs', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const text = editor.document.getText();
        const mcqs = learningMode.generateMCQs(text, editor.document.languageId);
        
        if (mcqs.length > 0) {
            await overlayManager.showMCQs(mcqs, editor.document.uri);
        } else {
            vscode.window.showInformationMessage('No MCQs generated for this code. Try selecting specific code sections.');
        }
    });

    const generateProjectIdeas = vscode.commands.registerCommand('knowcode.generateProjectIdeas', async () => {
        const technologies = await vscode.window.showInputBox({
            prompt: 'Enter your preferred technologies (comma-separated)',
            placeHolder: 'e.g., JavaScript, React, Node.js'
        });

        const techList = technologies ? technologies.split(',').map(t => t.trim()) : [];
        const ideas = learningMode.generateProjectIdeas(techList);
        
        await overlayManager.showProjectIdeas(ideas);
    });

    const generateBoilerplate = vscode.commands.registerCommand('knowcode.generateBoilerplate', async () => {
        const projectName = await vscode.window.showInputBox({
            prompt: 'Enter project name',
            placeHolder: 'My Awesome Project'
        });

        if (!projectName) return;

        const projectTypes = [
            { label: 'React App', value: 'react-app' },
            { label: 'Node.js API', value: 'node-api' }
        ];

        const selectedType = await vscode.window.showQuickPick(projectTypes, {
            placeHolder: 'Choose project type'
        });

        if (!selectedType) return;

        const boilerplate = learningMode.generateBoilerplate(selectedType.value, projectName);
        await overlayManager.showBoilerplate(boilerplate, projectName);
    });

    const generateAIComments = vscode.commands.registerCommand('knowcode.generateAIComments', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const text = editor.document.getText();
        const comments = enhancedExplainer.generateAIComments(text, editor.document.languageId);
        
        if (comments.length > 0) {
            await overlayManager.showAIComments(comments, editor.document.uri);
        } else {
            vscode.window.showInformationMessage('No AI comments generated for this code.');
        }
    });

    const generateResumeBullet = vscode.commands.registerCommand('knowcode.generateResumeBullet', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showInformationMessage('Please select some code to generate resume bullet');
            return;
        }

        const resumeBullet = enhancedExplainer.generateResumeBullet(text, editor.document.languageId);
        const timeComplexity = enhancedExplainer.generateTimeComplexity(text, editor.document.languageId);
        const optimizationTips = enhancedExplainer.generateOptimizationTips(text, editor.document.languageId);
        
        await overlayManager.showResumeBullet(resumeBullet, timeComplexity, optimizationTips, selection);
    });

    // Register hover provider for auto-explanation
    const hoverProvider = vscode.languages.registerHoverProvider('*', {
        async provideHover(document, position, token) {
            const config = vscode.workspace.getConfiguration('knowcode');
            if (!config.get('autoExplain')) {
                return null;
            }

            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return null;
            }

            const word = document.getText(wordRange);
            const context = await contextAnalyzer.getContextAtPosition(document, position);
            
            if (context.type === 'function') {
                const explanation = await codeExplainer.explainFunction(context.text, document.languageId);
                return new vscode.Hover([
                    '**KNOWCODE Function Explanation**',
                    explanation.summary
                ]);
            } else if (context.type === 'variable') {
                const explanation = await codeExplainer.explainVariable(context.text, document.languageId);
                return new vscode.Hover([
                    '**KNOWCODE Variable Explanation**',
                    explanation.summary
                ]);
            }

            return null;
        }
    });

    // Register all disposables
    context.subscriptions.push(
        explainSelection,
        explainFunction,
        explainVariable,
        showDiagram,
        toggleOverlay,
        explainWithMode,
        toggleLearningMode,
        generateMCQs,
        generateProjectIdeas,
        generateBoilerplate,
        generateAIComments,
        generateResumeBullet,
        hoverProvider
    );
}

export function deactivate() {
    console.log('KNOWCODE extension is now deactivated!');
} 