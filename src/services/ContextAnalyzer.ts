import * as vscode from 'vscode';

export interface CodeContext {
    type: 'function' | 'variable' | 'class' | 'import' | 'comment' | 'unknown';
    text: string;
    range: vscode.Range;
    name?: string;
}

export class ContextAnalyzer {
    async findFunctionAtPosition(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Range | null> {
        const text = document.getText();
        const lines = text.split('\n');
        const currentLine = position.line;
        
        // Look for function definition patterns
        const functionPatterns = this.getFunctionPatterns(document.languageId);
        
        for (let i = currentLine; i >= 0; i--) {
            const line = lines[i];
            for (const pattern of functionPatterns) {
                const match = line.match(pattern);
                if (match) {
                    // Found a function definition, now find its end
                    const startLine = i;
                    const endLine = this.findFunctionEnd(lines, i, document.languageId);
                    if (endLine !== -1) {
                        return new vscode.Range(
                            new vscode.Position(startLine, 0),
                            new vscode.Position(endLine, lines[endLine].length)
                        );
                    }
                }
            }
        }
        
        return null;
    }

    async findVariableAtPosition(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Range | null> {
        const text = document.getText();
        const lines = text.split('\n');
        const currentLine = position.line;
        const currentChar = position.character;
        
        // Look for variable declaration patterns
        const variablePatterns = this.getVariablePatterns(document.languageId);
        
        const line = lines[currentLine];
        for (const pattern of variablePatterns) {
            const match = line.match(pattern);
            if (match) {
                const startChar = match.index || 0;
                const endChar = startChar + match[0].length;
                
                // Check if the cursor is within the variable declaration
                if (currentChar >= startChar && currentChar <= endChar) {
                    return new vscode.Range(
                        new vscode.Position(currentLine, startChar),
                        new vscode.Position(currentLine, endChar)
                    );
                }
            }
        }
        
        return null;
    }

    async getContextAtPosition(document: vscode.TextDocument, position: vscode.Position): Promise<CodeContext> {
        const text = document.getText();
        const lines = text.split('\n');
        const currentLine = position.line;
        const currentChar = position.character;
        const line = lines[currentLine];
        
        // Check for function context
        const functionRange = await this.findFunctionAtPosition(document, position);
        if (functionRange) {
            const functionText = document.getText(functionRange);
            return {
                type: 'function',
                text: functionText,
                range: functionRange,
                name: this.extractFunctionName(functionText, document.languageId)
            };
        }
        
        // Check for variable context
        const variableRange = await this.findVariableAtPosition(document, position);
        if (variableRange) {
            const variableText = document.getText(variableRange);
            return {
                type: 'variable',
                text: variableText,
                range: variableRange,
                name: this.extractVariableName(variableText, document.languageId)
            };
        }
        
        // Check for class context
        const classRange = this.findClassAtPosition(document, position);
        if (classRange) {
            const classText = document.getText(classRange);
            return {
                type: 'class',
                text: classText,
                range: classRange,
                name: this.extractClassName(classText, document.languageId)
            };
        }
        
        // Check for import context
        if (this.isImportLine(line, document.languageId)) {
            return {
                type: 'import',
                text: line,
                range: new vscode.Range(
                    new vscode.Position(currentLine, 0),
                    new vscode.Position(currentLine, line.length)
                )
            };
        }
        
        // Check for comment context
        if (this.isCommentLine(line, document.languageId)) {
            return {
                type: 'comment',
                text: line,
                range: new vscode.Range(
                    new vscode.Position(currentLine, 0),
                    new vscode.Position(currentLine, line.length)
                )
            };
        }
        
        // Default to unknown context
        return {
            type: 'unknown',
            text: line,
            range: new vscode.Range(
                new vscode.Position(currentLine, 0),
                new vscode.Position(currentLine, line.length)
            )
        };
    }

    private getFunctionPatterns(languageId: string): RegExp[] {
        const patterns: { [key: string]: RegExp[] } = {
            javascript: [
                /function\s+\w+\s*\([^)]*\)\s*\{/,
                /const\s+\w+\s*=\s*\([^)]*\)\s*=>/,
                /let\s+\w+\s*=\s*\([^)]*\)\s*=>/,
                /var\s+\w+\s*=\s*\([^)]*\)\s*=>/,
                /async\s+function\s+\w+\s*\([^)]*\)\s*\{/
            ],
            typescript: [
                /function\s+\w+\s*\([^)]*\)\s*\{/,
                /const\s+\w+\s*:\s*\w*\s*=\s*\([^)]*\)\s*=>/,
                /let\s+\w+\s*:\s*\w*\s*=\s*\([^)]*\)\s*=>/,
                /var\s+\w+\s*:\s*\w*\s*=\s*\([^)]*\)\s*=>/,
                /async\s+function\s+\w+\s*\([^)]*\)\s*\{/
            ],
            python: [
                /def\s+\w+\s*\([^)]*\)\s*:/,
                /async\s+def\s+\w+\s*\([^)]*\)\s*:/
            ],
            java: [
                /(?:public|private|protected)?\s*(?:static\s+)?\w+\s+\w+\s*\([^)]*\)\s*\{/,
                /(?:public|private|protected)?\s*(?:static\s+)?\w+\s+\w+\s*\([^)]*\)\s*throws\s+\w+\s*\{/
            ]
        };
        
        return patterns[languageId] || patterns.javascript;
    }

    private getVariablePatterns(languageId: string): RegExp[] {
        const patterns: { [key: string]: RegExp[] } = {
            javascript: [
                /(?:const|let|var)\s+\w+\s*=/,
                /const\s+\w+\s*:\s*\w*\s*=/,
                /let\s+\w+\s*:\s*\w*\s*=/,
                /var\s+\w+\s*:\s*\w*\s*=/
            ],
            typescript: [
                /(?:const|let|var)\s+\w+\s*:\s*\w*\s*=/,
                /(?:const|let|var)\s+\w+\s*=/
            ],
            python: [
                /\w+\s*=/,
                /(?:global\s+)?\w+\s*:/
            ],
            java: [
                /(?:final\s+)?(?:public|private|protected)?\s*\w+\s+\w+\s*;/,
                /(?:final\s+)?(?:public|private|protected)?\s*\w+\s+\w+\s*=/
            ]
        };
        
        return patterns[languageId] || patterns.javascript;
    }

    private findFunctionEnd(lines: string[], startLine: number, languageId: string): number {
        const openBrace = this.getOpenBrace(languageId);
        const closeBrace = this.getCloseBrace(languageId);
        
        let braceCount = 0;
        let foundFirstBrace = false;
        
        for (let i = startLine; i < lines.length; i++) {
            const line = lines[i];
            
            // Count braces
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === openBrace) {
                    braceCount++;
                    foundFirstBrace = true;
                } else if (char === closeBrace) {
                    braceCount--;
                    if (foundFirstBrace && braceCount === 0) {
                        return i;
                    }
                }
            }
            
            // For Python, check for indentation
            if (languageId === 'python' && foundFirstBrace) {
                const currentIndent = this.getIndentation(line);
                const startIndent = this.getIndentation(lines[startLine]);
                
                if (currentIndent <= startIndent && line.trim().length > 0) {
                    return i - 1;
                }
            }
        }
        
        return -1;
    }

    private getOpenBrace(languageId: string): string {
        return languageId === 'python' ? ':' : '{';
    }

    private getCloseBrace(languageId: string): string {
        return languageId === 'python' ? '' : '}';
    }

    private getIndentation(line: string): number {
        return line.length - line.trimStart().length;
    }

    private findClassAtPosition(document: vscode.TextDocument, position: vscode.Position): vscode.Range | null {
        const text = document.getText();
        const lines = text.split('\n');
        const currentLine = position.line;
        
        // Look for class definition patterns
        const classPatterns = this.getClassPatterns(document.languageId);
        
        for (let i = currentLine; i >= 0; i--) {
            const line = lines[i];
            for (const pattern of classPatterns) {
                const match = line.match(pattern);
                if (match) {
                    // Found a class definition, now find its end
                    const startLine = i;
                    const endLine = this.findClassEnd(lines, i, document.languageId);
                    if (endLine !== -1) {
                        return new vscode.Range(
                            new vscode.Position(startLine, 0),
                            new vscode.Position(endLine, lines[endLine].length)
                        );
                    }
                }
            }
        }
        
        return null;
    }

    private getClassPatterns(languageId: string): RegExp[] {
        const patterns: { [key: string]: RegExp[] } = {
            javascript: [
                /class\s+\w+/,
                /class\s+\w+\s+extends/,
                /class\s+\w+\s+implements/
            ],
            typescript: [
                /class\s+\w+/,
                /class\s+\w+\s+extends/,
                /class\s+\w+\s+implements/,
                /abstract\s+class\s+\w+/
            ],
            python: [
                /class\s+\w+/,
                /class\s+\w+\s*\(/,
                /class\s+\w+\s*\([^)]*\)/
            ],
            java: [
                /(?:public|private|protected)?\s*class\s+\w+/,
                /(?:public|private|protected)?\s*abstract\s+class\s+\w+/,
                /(?:public|private|protected)?\s*class\s+\w+\s+extends/,
                /(?:public|private|protected)?\s*class\s+\w+\s+implements/
            ]
        };
        
        return patterns[languageId] || patterns.javascript;
    }

    private findClassEnd(lines: string[], startLine: number, languageId: string): number {
        const openBrace = this.getOpenBrace(languageId);
        const closeBrace = this.getCloseBrace(languageId);
        
        let braceCount = 0;
        let foundFirstBrace = false;
        
        for (let i = startLine; i < lines.length; i++) {
            const line = lines[i];
            
            // Count braces
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === openBrace) {
                    braceCount++;
                    foundFirstBrace = true;
                } else if (char === closeBrace) {
                    braceCount--;
                    if (foundFirstBrace && braceCount === 0) {
                        return i;
                    }
                }
            }
            
            // For Python, check for indentation
            if (languageId === 'python' && foundFirstBrace) {
                const currentIndent = this.getIndentation(line);
                const startIndent = this.getIndentation(lines[startLine]);
                
                if (currentIndent <= startIndent && line.trim().length > 0) {
                    return i - 1;
                }
            }
        }
        
        return -1;
    }

    private isImportLine(line: string, languageId: string): boolean {
        const patterns: { [key: string]: RegExp } = {
            javascript: /^import\s+/,
            typescript: /^import\s+/,
            python: /^(?:import|from)\s+/,
            java: /^import\s+/
        };
        
        const pattern = patterns[languageId];
        return pattern ? pattern.test(line.trim()) : false;
    }

    private isCommentLine(line: string, languageId: string): boolean {
        const patterns: { [key: string]: RegExp } = {
            javascript: /^\s*\/\//,
            typescript: /^\s*\/\//,
            python: /^\s*#/,
            java: /^\s*\/\//
        };
        
        const pattern = patterns[languageId];
        return pattern ? pattern.test(line.trim()) : false;
    }

    private extractFunctionName(functionText: string, languageId: string): string | undefined {
        const patterns: { [key: string]: RegExp } = {
            javascript: /function\s+(\w+)/,
            typescript: /function\s+(\w+)/,
            python: /def\s+(\w+)/,
            java: /(\w+)\s*\([^)]*\)\s*\{/
        };
        
        const pattern = patterns[languageId];
        if (!pattern) return undefined;
        
        const match = functionText.match(pattern);
        return match ? match[1] : undefined;
    }

    private extractVariableName(variableText: string, languageId: string): string | undefined {
        const patterns: { [key: string]: RegExp } = {
            javascript: /(?:const|let|var)\s+(\w+)/,
            typescript: /(?:const|let|var)\s+(\w+)/,
            python: /(\w+)\s*=/,
            java: /(\w+)\s*[=;]/
        };
        
        const pattern = patterns[languageId];
        if (!pattern) return undefined;
        
        const match = variableText.match(pattern);
        return match ? match[1] : undefined;
    }

    private extractClassName(classText: string, languageId: string): string | undefined {
        const patterns: { [key: string]: RegExp } = {
            javascript: /class\s+(\w+)/,
            typescript: /class\s+(\w+)/,
            python: /class\s+(\w+)/,
            java: /(?:public|private|protected)?\s*class\s+(\w+)/
        };
        
        const pattern = patterns[languageId];
        if (!pattern) return undefined;
        
        const match = classText.match(pattern);
        return match ? match[1] : undefined;
    }
} 