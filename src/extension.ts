import * as vscode from 'vscode';
import { CodeExplainer } from './services/CodeExplainer';
import { OverlayManager } from './services/OverlayManager';
import { DiagramGenerator } from './services/DiagramGenerator';
import { ContextAnalyzer } from './services/ContextAnalyzer';
import { EnhancedExplainer } from './services/EnhancedExplainer';
import { LearningMode } from './services/LearningMode';
import { SetupManager } from './services/SetupManager';
import { LocalModelService } from './services/LocalModelService';
import { APIKeyManager } from './services/APIKeyManager';
import { UnifiedAIService } from './services/UnifiedAIService';
import { MCQ, ProjectIdea } from './services/LearningMode';
import { KNOWCODEPanel } from './services/KNOWCODEPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('KNOWCODE extension is now active!');
    vscode.window.showInformationMessage('KNOWCODE extension is now active! 🎉');

    // Initialize services
    const setupManager = SetupManager.getInstance(context);
    const apiKeyManager = APIKeyManager.getInstance(context);
    const unifiedAIService = UnifiedAIService.getInstance(apiKeyManager);
    const localModelService = LocalModelService.getInstance();
    const codeExplainer = new CodeExplainer();
    const overlayManager = new OverlayManager();
    const diagramGenerator = new DiagramGenerator();
    const contextAnalyzer = new ContextAnalyzer();
    const enhancedExplainer = new EnhancedExplainer();
    const learningMode = new LearningMode();

    // Check first run setup
    setupManager.checkFirstRun();

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
            const context = `Language: ${editor.document.languageId}, File: ${editor.document.fileName}`;
            const response = await localModelService.generateExplanation(text, context, 'default');
            
            if (response.success) {
                const explanation = {
                    summary: response.content.substring(0, 200) + '...',
                    details: response.content,
                    complexity: 'moderate' as const,
                    concepts: ['Code Analysis', 'Programming Concepts']
                };
                await overlayManager.showExplanation(explanation, selection);
            } else {
                vscode.window.showErrorMessage(`Failed to explain code: ${response.error}`);
            }
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
            // Use local model for MVP features
            const context = `Language: ${editor.document.languageId}, File: ${editor.document.fileName}`;
            let response;
            
            switch (modeId) {
                case 'explain-like-5':
                    response = await localModelService.generateExplainLike5(text, context);
                    break;
                case 'step-by-step':
                    response = await localModelService.generateStepByStepBreakdown(text, context);
                    break;
                case 'whats-next':
                    response = await localModelService.generateWhatsNext(text, context);
                    break;
                case 'debug-insight':
                    response = await localModelService.generateDebugInsight(text, context);
                    break;
                case 'learning-mode':
                    response = await localModelService.generateLearningSteps(text, context);
                    break;
                case 'interview-mode':
                    response = await localModelService.generateInterviewExplanation(text, context);
                    break;
                case 'project-idea':
                    response = await localModelService.generateProjectIdea(text, context);
                    break;
                case 'mcq-generator':
                    response = await localModelService.generateMCQs(text, context);
                    break;
                default:
                    response = await localModelService.generateExplanation(text, context, modeId);
            }
            
            if (response.success) {
                await overlayManager.showEnhancedExplanation(response.content, selection, modeId);
            } else {
                vscode.window.showErrorMessage(`Failed to generate explanation: ${response.error}`);
            }
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

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showInformationMessage('Please select some code to generate MCQs for');
            return;
        }

        try {
            const context = `Language: ${editor.document.languageId}, File: ${editor.document.fileName}`;
            const response = await localModelService.generateMCQs(text, context);
            
            if (response.success) {
                // Parse the MCQ response and create proper MCQ objects
                const mcqContent = response.content;
                const mcqs = parseMCQResponse(mcqContent);
                await overlayManager.showMCQs(mcqs, editor.document.uri);
            } else {
                vscode.window.showErrorMessage(`Failed to generate MCQs: ${response.error}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to generate MCQs: ${error}`);
        }
    });

    const generateProjectIdeas = vscode.commands.registerCommand('knowcode.generateProjectIdeas', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        if (!text.trim()) {
            vscode.window.showInformationMessage('Please select some code to generate project ideas for');
            return;
        }

        try {
            const context = `Language: ${editor.document.languageId}, File: ${editor.document.fileName}`;
            const response = await localModelService.generateProjectIdea(text, context);
            
            if (response.success) {
                // Parse the project idea response and create proper ProjectIdea objects
                const projectContent = response.content;
                const projectIdeas = parseProjectIdeaResponse(projectContent);
                await overlayManager.showProjectIdeas(projectIdeas);
            } else {
                vscode.window.showErrorMessage(`Failed to generate project ideas: ${response.error}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to generate project ideas: ${error}`);
        }
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

    // Setup and Local Model Management Commands
    const openSetup = vscode.commands.registerCommand('knowcode.openSetup', async () => {
        await setupManager.checkFirstRun();
    });

    const testLocalModel = vscode.commands.registerCommand('knowcode.testLocalModel', async () => {
        const isWorking = await localModelService.testConnection();
        if (isWorking) {
            vscode.window.showInformationMessage('✅ Local model is working correctly!');
        } else {
            vscode.window.showErrorMessage('❌ Local model is not working. Please check Ollama installation.');
        }
    });

    const showModelInfo = vscode.commands.registerCommand('knowcode.showModelInfo', async () => {
        const modelInfo = await localModelService.getModelInfo();
        const message = `Model: ${modelInfo.name}\nSize: ${modelInfo.size}\nStatus: ${modelInfo.status}`;
        vscode.window.showInformationMessage(message);
    });

    const restartOllama = vscode.commands.registerCommand('knowcode.restartOllama', async () => {
        await setupManager.restartOllama();
        vscode.window.showInformationMessage('🔄 Ollama restarted. Please wait a moment for it to be ready.');
    });

    // KNOWCODE Panel Command
    const openKNOWCODEPanel = vscode.commands.registerCommand('knowcode.openPanel', () => {
        const knowcodePanel = KNOWCODEPanel.getInstance();
        knowcodePanel.createPanel();
    });

    // API Key Management Commands
    const manageAPIKeys = vscode.commands.registerCommand('knowcode.manageAPIKeys', async () => {
        try {
            await apiKeyManager.showAPIKeyManager();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to manage API keys: ${error}`);
        }
    });

    const showAPIKeyStatus = vscode.commands.registerCommand('knowcode.showAPIKeyStatus', async () => {
        try {
            await apiKeyManager.showAPIKeyStatus();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to show API key status: ${error}`);
        }
    });

    const setAIPreference = vscode.commands.registerCommand('knowcode.setAIPreference', async () => {
        const preference = await vscode.window.showQuickPick(
            ['Auto (Choose best available)', 'Local Ollama', 'Cloud API'],
            {
                placeHolder: 'Select your preferred AI provider'
            }
        );

        if (preference) {
            let provider: 'local' | 'cloud' | 'auto';
            switch (preference) {
                case 'Local Ollama':
                    provider = 'local';
                    break;
                case 'Cloud API':
                    provider = 'cloud';
                    break;
                default:
                    provider = 'auto';
            }
            
            unifiedAIService.setPreferredProvider(provider);
            const status = unifiedAIService.getCurrentProviderInfo();
            vscode.window.showInformationMessage(`AI preference set to: ${status.provider} 🎯`);
        }
    });

    const testAIConnections = vscode.commands.registerCommand('knowcode.testAIConnections', async () => {
        vscode.window.showInformationMessage('Testing AI connections... 🔍');
        
        try {
            const results = await unifiedAIService.testConnections();
            const status = unifiedAIService.getCurrentProviderInfo();
            
            let message = `**AI Connection Test Results**\n\n`;
            message += `**Current Provider**: ${status.provider}\n`;
            message += `**Details**: ${status.details}\n\n`;
            message += `**Connection Status**:\n${results.details}`;
            
            await vscode.window.showInformationMessage(message);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to test connections: ${error}`);
        }
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

    // Helper methods for parsing responses
    function parseMCQResponse(content: string): MCQ[] {
        try {
            // Simple parsing of MCQ format
            const mcqs: MCQ[] = [];
            const lines = content.split('\n');
            let currentMCQ: Partial<MCQ> = {};
            
            for (const line of lines) {
                if (line.includes('Question:')) {
                    if (currentMCQ.question) {
                        mcqs.push(currentMCQ as MCQ);
                    }
                    currentMCQ = {
                        question: line.replace('Question:', '').trim(),
                        options: [],
                        correctAnswer: 0,
                        explanation: '',
                        category: 'Code Analysis'
                    };
                } else if (line.match(/^[A-D]\)/)) {
                    currentMCQ.options?.push(line.replace(/^[A-D]\)\s*/, '').trim());
                } else if (line.includes('Answer:')) {
                    const answer = line.replace('Answer:', '').trim();
                    const answerIndex = answer.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
                    currentMCQ.correctAnswer = answerIndex;
                } else if (line.trim() && currentMCQ.question && !currentMCQ.explanation) {
                    currentMCQ.explanation = line.trim();
                }
            }
            
            if (currentMCQ.question) {
                mcqs.push(currentMCQ as MCQ);
            }
            
            return mcqs.length > 0 ? mcqs : [{
                question: 'Code Analysis Question',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 0,
                explanation: content,
                category: 'Code Analysis'
            }];
        } catch (error) {
            return [{
                question: 'Code Analysis Question',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 0,
                explanation: content,
                category: 'Code Analysis'
            }];
        }
    }

    function parseProjectIdeaResponse(content: string): ProjectIdea[] {
        try {
            // Simple parsing of project idea format
            const lines = content.split('\n');
            let title = 'Project Idea';
            let description = content;
            let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
            let technologies: string[] = [];
            let learningOutcomes: string[] = [];
            
            for (const line of lines) {
                if (line.includes('**Project Name**:')) {
                    title = line.replace('**Project Name**:', '').trim();
                } else if (line.includes('**Description**:')) {
                    description = line.replace('**Description**:', '').trim();
                } else if (line.includes('**Difficulty**:')) {
                    const diff = line.replace('**Difficulty**:', '').trim().toLowerCase();
                    if (diff.includes('beginner')) difficulty = 'beginner';
                    else if (diff.includes('advanced')) difficulty = 'advanced';
                    else difficulty = 'intermediate';
                } else if (line.includes('**Technologies**:')) {
                    const tech = line.replace('**Technologies**:', '').trim();
                    technologies = tech.split(',').map(t => t.trim());
                } else if (line.includes('**Learning Outcomes**:')) {
                    const outcomes = line.replace('**Learning Outcomes**:', '').trim();
                    learningOutcomes = outcomes.split(',').map(o => o.trim());
                }
            }
            
            return [{
                title,
                description,
                difficulty,
                technologies: technologies.length > 0 ? technologies : ['Programming'],
                learningOutcomes: learningOutcomes.length > 0 ? learningOutcomes : ['Code Understanding'],
                resources: []
            }];
        } catch (error) {
            return [{
                title: 'Code-Based Project',
                description: content,
                difficulty: 'intermediate',
                technologies: ['Programming'],
                learningOutcomes: ['Code Understanding'],
                resources: []
            }];
        }
    }

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
        openSetup,
        testLocalModel,
        showModelInfo,
        restartOllama,
        openKNOWCODEPanel,
        manageAPIKeys,
        showAPIKeyStatus,
        setAIPreference,
        testAIConnections,
        hoverProvider
    );
}

export function deactivate() {
    console.log('KNOWCODE extension is now deactivated!');
} 