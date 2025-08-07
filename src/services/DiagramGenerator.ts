import * as vscode from 'vscode';
import { Diagram } from './OverlayManager';

export class DiagramGenerator {
    async generateDiagram(code: string, languageId: string): Promise<Diagram> {
        const codeType = this.detectCodeType(code, languageId);
        
        switch (codeType) {
            case 'function':
                return this.generateFunctionDiagram(code, languageId);
            case 'class':
                return this.generateClassDiagram(code, languageId);
            case 'control-flow':
                return this.generateFlowchart(code, languageId);
            case 'sequence':
                return this.generateSequenceDiagram(code, languageId);
            default:
                return this.generateGenericDiagram(code, languageId);
        }
    }

    private detectCodeType(code: string, languageId: string): 'function' | 'class' | 'control-flow' | 'sequence' | 'generic' {
        const trimmedCode = code.trim();
        
        // Check for function definitions
        if (this.isFunction(trimmedCode, languageId)) {
            return 'function';
        }
        
        // Check for class definitions
        if (this.isClass(trimmedCode, languageId)) {
            return 'class';
        }
        
        // Check for control flow structures
        if (this.hasControlFlow(trimmedCode)) {
            return 'control-flow';
        }
        
        // Check for sequence-like code (function calls, async operations)
        if (this.isSequence(trimmedCode)) {
            return 'sequence';
        }
        
        return 'generic';
    }

    private isFunction(code: string, languageId: string): boolean {
        const patterns = {
            javascript: /function\s+\w+\s*\(/,
            typescript: /function\s+\w+\s*\(/,
            python: /def\s+\w+\s*\(/,
            java: /\w+\s+\w+\s*\([^)]*\)\s*\{/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        return pattern ? pattern.test(code) : false;
    }

    private isClass(code: string, languageId: string): boolean {
        const patterns = {
            javascript: /class\s+\w+/,
            typescript: /class\s+\w+/,
            python: /class\s+\w+/,
            java: /(?:public\s+)?class\s+\w+/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        return pattern ? pattern.test(code) : false;
    }

    private hasControlFlow(code: string): boolean {
        return /if\s*\(|else\s*\{|for\s*\(|while\s*\(|switch\s*\(/.test(code);
    }

    private isSequence(code: string): boolean {
        return /await\s+|Promise\.|\.then\(|\.catch\(/.test(code);
    }

    private generateFunctionDiagram(code: string, languageId: string): Diagram {
        const functionName = this.extractFunctionName(code, languageId);
        const parameters = this.extractParameters(code, languageId);
        const returnType = this.extractReturnType(code, languageId);
        
        const mermaidContent = `
            flowchart TD
                A[Start] --> B[Function: ${functionName}]
                B --> C[Parameters: ${parameters.join(', ') || 'none'}]
                C --> D[Function Body]
                D --> E[Return ${returnType || 'void'}]
                E --> F[End]
                
                style B fill:#e1f5fe
                style C fill:#f3e5f5
                style E fill:#e8f5e8
        `;
        
        return {
            type: 'flowchart',
            content: mermaidContent,
            title: `Function: ${functionName}`
        };
    }

    private generateClassDiagram(code: string, languageId: string): Diagram {
        const className = this.extractClassName(code, languageId);
        const methods = this.extractMethods(code, languageId);
        const properties = this.extractProperties(code, languageId);
        
        let mermaidContent = `
            classDiagram
                class ${className} {
        `;
        
        // Add properties
        properties.forEach(prop => {
            mermaidContent += `                    ${prop}\n`;
        });
        
        // Add methods
        methods.forEach(method => {
            mermaidContent += `                    ${method}\n`;
        });
        
        mermaidContent += `                }`;
        
        return {
            type: 'classDiagram',
            content: mermaidContent,
            title: `Class: ${className}`
        };
    }

    private generateFlowchart(code: string, languageId: string): Diagram {
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        let mermaidContent = `
            flowchart TD
        `;
        
        let nodeCounter = 0;
        const nodes: string[] = [];
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            const nodeId = `A${nodeCounter}`;
            
            if (trimmedLine.includes('if')) {
                const condition = this.extractCondition(trimmedLine);
                mermaidContent += `                ${nodeId}{${condition}}\n`;
                nodes.push(nodeId);
            } else if (trimmedLine.includes('for') || trimmedLine.includes('while')) {
                const loopCondition = this.extractLoopCondition(trimmedLine);
                mermaidContent += `                ${nodeId}[${loopCondition}]\n`;
                nodes.push(nodeId);
            } else if (trimmedLine.includes('return')) {
                mermaidContent += `                ${nodeId}[Return]\n`;
                nodes.push(nodeId);
            } else {
                const action = this.simplifyLine(trimmedLine);
                mermaidContent += `                ${nodeId}[${action}]\n`;
                nodes.push(nodeId);
            }
            
            nodeCounter++;
        });
        
        // Connect nodes
        for (let i = 0; i < nodes.length - 1; i++) {
            mermaidContent += `                ${nodes[i]} --> ${nodes[i + 1]}\n`;
        }
        
        return {
            type: 'flowchart',
            content: mermaidContent,
            title: 'Control Flow Diagram'
        };
    }

    private generateSequenceDiagram(code: string, languageId: string): Diagram {
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        let mermaidContent = `
            sequenceDiagram
                participant User
                participant Function
                participant System
        `;
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.includes('await') || trimmedLine.includes('Promise')) {
                mermaidContent += `                User->>Function: Call\n`;
                mermaidContent += `                Function->>System: Async Operation\n`;
                mermaidContent += `                System-->>Function: Response\n`;
                mermaidContent += `                Function-->>User: Result\n`;
            } else if (trimmedLine.includes('function') || trimmedLine.includes('def')) {
                mermaidContent += `                Note over Function: Define ${this.extractFunctionName(trimmedLine, languageId)}\n`;
            } else {
                mermaidContent += `                Note over Function: ${this.simplifyLine(trimmedLine)}\n`;
            }
        });
        
        return {
            type: 'sequenceDiagram',
            content: mermaidContent,
            title: 'Sequence Diagram'
        };
    }

    private generateGenericDiagram(code: string, languageId: string): Diagram {
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        let mermaidContent = `
            flowchart TD
        `;
        
        lines.forEach((line, index) => {
            const simplifiedLine = this.simplifyLine(line.trim());
            mermaidContent += `                A${index}[${simplifiedLine}]\n`;
            
            if (index > 0) {
                mermaidContent += `                A${index - 1} --> A${index}\n`;
            }
        });
        
        return {
            type: 'flowchart',
            content: mermaidContent,
            title: 'Code Structure'
        };
    }

    private extractFunctionName(code: string, languageId: string): string {
        const patterns = {
            javascript: /function\s+(\w+)/,
            typescript: /function\s+(\w+)/,
            python: /def\s+(\w+)/,
            java: /(\w+)\s*\([^)]*\)\s*\{/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        const match = code.match(pattern);
        return match ? match[1] : 'unknown';
    }

    private extractParameters(code: string, languageId: string): string[] {
        const patterns = {
            javascript: /function\s+\w+\s*\(([^)]*)\)/,
            typescript: /function\s+\w+\s*\(([^)]*)\)/,
            python: /def\s+\w+\s*\(([^)]*)\)/,
            java: /(\w+)\s*\(([^)]*)\)\s*\{/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        const match = code.match(pattern);
        
        if (!match) return [];
        
        const params = match[1] || match[2] || '';
        return params.split(',').map(p => p.trim()).filter(p => p.length > 0);
    }

    private extractReturnType(code: string, languageId: string): string | null {
        if (languageId === 'typescript') {
            const match = code.match(/:\s*(\w+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    private extractClassName(code: string, languageId: string): string {
        const patterns = {
            javascript: /class\s+(\w+)/,
            typescript: /class\s+(\w+)/,
            python: /class\s+(\w+)/,
            java: /(?:public\s+)?class\s+(\w+)/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        const match = code.match(pattern);
        return match ? match[1] : 'unknown';
    }

    private extractMethods(code: string, languageId: string): string[] {
        const methods: string[] = [];
        const lines = code.split('\n');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (this.isMethodLine(trimmedLine, languageId)) {
                const methodName = this.extractMethodName(trimmedLine, languageId);
                if (methodName) {
                    methods.push(methodName);
                }
            }
        });
        
        return methods;
    }

    private extractProperties(code: string, languageId: string): string[] {
        const properties: string[] = [];
        const lines = code.split('\n');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (this.isPropertyLine(trimmedLine, languageId)) {
                const propertyName = this.extractPropertyName(trimmedLine, languageId);
                if (propertyName) {
                    properties.push(propertyName);
                }
            }
        });
        
        return properties;
    }

    private isMethodLine(line: string, languageId: string): boolean {
        const patterns = {
            javascript: /^\w+\s*\([^)]*\)\s*\{/,
            typescript: /^\w+\s*\([^)]*\)\s*\{/,
            python: /^\s*def\s+\w+/,
            java: /^\s*(?:public|private|protected)?\s*\w+\s+\w+\s*\(/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        return pattern ? pattern.test(line) : false;
    }

    private isPropertyLine(line: string, languageId: string): boolean {
        const patterns = {
            javascript: /^\w+\s*=/,
            typescript: /^\w+\s*:/,
            python: /^\s*self\.\w+/,
            java: /^\s*(?:public|private|protected)?\s*\w+\s+\w+\s*;/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        return pattern ? pattern.test(line) : false;
    }

    private extractMethodName(line: string, languageId: string): string | null {
        const patterns = {
            javascript: /(\w+)\s*\(/,
            typescript: /(\w+)\s*\(/,
            python: /def\s+(\w+)/,
            java: /(\w+)\s*\(/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        const match = line.match(pattern);
        return match ? match[1] : null;
    }

    private extractPropertyName(line: string, languageId: string): string | null {
        const patterns = {
            javascript: /(\w+)\s*=/,
            typescript: /(\w+)\s*:/,
            python: /self\.(\w+)/,
            java: /(\w+)\s*;/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        const match = line.match(pattern);
        return match ? match[1] : null;
    }

    private extractCondition(line: string): string {
        const match = line.match(/if\s*\(([^)]+)\)/);
        return match ? match[1].trim() : 'condition';
    }

    private extractLoopCondition(line: string): string {
        if (line.includes('for')) {
            const match = line.match(/for\s*\(([^)]+)\)/);
            return match ? `for ${match[1].trim()}` : 'for loop';
        } else if (line.includes('while')) {
            const match = line.match(/while\s*\(([^)]+)\)/);
            return match ? `while ${match[1].trim()}` : 'while loop';
        }
        return 'loop';
    }

    private simplifyLine(line: string): string {
        // Remove common patterns to simplify the line for diagram display
        return line
            .replace(/^\s*/, '') // Remove leading whitespace
            .replace(/\s*$/, '') // Remove trailing whitespace
            .replace(/\/\/.*$/, '') // Remove single-line comments
            .replace(/\/\*.*?\*\//g, '') // Remove multi-line comments
            .substring(0, 30) // Limit length
            + (line.length > 30 ? '...' : '');
    }
} 