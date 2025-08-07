import * as assert from 'assert';
import * as vscode from 'vscode';
import { CodeExplainer } from '../../services/CodeExplainer';
import { DiagramGenerator } from '../../services/DiagramGenerator';
import { ContextAnalyzer } from '../../services/ContextAnalyzer';

suite('KNOWCODE Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('knowcode'));
    });

    test('Should activate', async () => {
        const ext = vscode.extensions.getExtension('knowcode');
        await ext?.activate();
        assert.ok(ext?.isActive);
    });

    test('CodeExplainer should explain JavaScript function', async () => {
        const explainer = new CodeExplainer();
        const code = 'function add(a, b) { return a + b; }';
        const explanation = await explainer.explainCode(code, 'javascript');
        
        assert.ok(explanation);
        assert.ok(explanation.summary);
        assert.ok(explanation.details);
        assert.ok(explanation.concepts.includes('Functions'));
    });

    test('CodeExplainer should explain Python function', async () => {
        const explainer = new CodeExplainer();
        const code = 'def multiply(x, y):\n    return x * y';
        const explanation = await explainer.explainCode(code, 'python');
        
        assert.ok(explanation);
        assert.ok(explanation.summary);
        assert.ok(explanation.details);
        assert.ok(explanation.concepts.includes('Functions'));
    });

    test('DiagramGenerator should generate function diagram', async () => {
        const generator = new DiagramGenerator();
        const code = 'function calculateSum(a, b) { return a + b; }';
        const diagram = await generator.generateDiagram(code, 'javascript');
        
        assert.ok(diagram);
        assert.ok(diagram.content);
        assert.ok(diagram.title);
        assert.ok(diagram.type === 'flowchart');
    });

    test('ContextAnalyzer should find function at position', async () => {
        const analyzer = new ContextAnalyzer();
        const document = await vscode.workspace.openTextDocument({
            content: 'function test() {\n    return true;\n}',
            language: 'javascript'
        });
        
        const position = new vscode.Position(0, 5); // Inside function name
        const range = await analyzer.findFunctionAtPosition(document, position);
        
        assert.ok(range);
        assert.ok(range.start.line === 0);
    });

    test('Should register all commands', async () => {
        const commands = await vscode.commands.getCommands();
        const knowcodeCommands = commands.filter(cmd => cmd.startsWith('knowcode.'));
        
        assert.ok(knowcodeCommands.includes('knowcode.explainSelection'));
        assert.ok(knowcodeCommands.includes('knowcode.explainFunction'));
        assert.ok(knowcodeCommands.includes('knowcode.explainVariable'));
        assert.ok(knowcodeCommands.includes('knowcode.showDiagram'));
        assert.ok(knowcodeCommands.includes('knowcode.toggleOverlay'));
    });
}); 