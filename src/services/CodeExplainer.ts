import * as vscode from 'vscode';

export interface CodeExplanation {
    summary: string;
    details: string;
    complexity: 'simple' | 'moderate' | 'complex';
    concepts: string[];
    examples?: string[];
    visualHint?: string;
    explanationMode?: ExplanationMode;
    followUpQuestions?: string[];
    timeComplexity?: string;
    optimizationTips?: string[];
    interviewQuestions?: string[];
    resumeBullet?: string;
}

export type ExplanationMode = 
    | 'explain-like-5' 
    | 'debug-step-by-step' 
    | 'why-approach' 
    | 'senior-engineer' 
    | 'peer-reviewer' 
    | 'beginner-student' 
    | 'bullet-points' 
    | 'flowchart' 
    | 'interview-prep' 
    | 'portfolio-pitch';

export interface PromptOption {
    id: string;
    label: string;
    description: string;
    icon: string;
}

export class CodeExplainer {
    private readonly languagePatterns: Map<string, RegExp[]> = new Map();
    private readonly explanationModes: Map<ExplanationMode, string> = new Map();

    constructor() {
        this.initializeLanguagePatterns();
        this.initializeExplanationModes();
    }

    private initializeExplanationModes(): void {
        this.explanationModes.set('explain-like-5', 'Explain this code as if I\'m 5 years old');
        this.explanationModes.set('debug-step-by-step', 'Debug this code step by step');
        this.explanationModes.set('why-approach', 'Why was this approach used?');
        this.explanationModes.set('senior-engineer', 'Explain as a senior engineer would');
        this.explanationModes.set('peer-reviewer', 'Review this code as a peer reviewer');
        this.explanationModes.set('beginner-student', 'Explain for a beginner student');
        this.explanationModes.set('bullet-points', 'Explain in bullet points');
        this.explanationModes.set('flowchart', 'Create a flowchart explanation');
        this.explanationModes.set('interview-prep', 'Explain as if in a technical interview');
        this.explanationModes.set('portfolio-pitch', 'Summarize as a project pitch');
    }

    getPromptOptions(): PromptOption[] {
        return [
            {
                id: 'explain-like-5',
                label: 'Explain like I\'m 5',
                description: 'Simple, easy-to-understand explanation',
                icon: '👶'
            },
            {
                id: 'debug-step-by-step',
                label: 'Debug step-by-step',
                description: 'Walk through the code execution',
                icon: '🐛'
            },
            {
                id: 'why-approach',
                label: 'Why this approach?',
                description: 'Explain the design decisions',
                icon: '🤔'
            },
            {
                id: 'senior-engineer',
                label: 'Senior Engineer View',
                description: 'Professional code review perspective',
                icon: '👨‍💻'
            },
            {
                id: 'peer-reviewer',
                label: 'Peer Review',
                description: 'Code review feedback',
                icon: '👥'
            },
            {
                id: 'beginner-student',
                label: 'Beginner Student',
                description: 'Educational explanation',
                icon: '📚'
            },
            {
                id: 'bullet-points',
                label: 'Bullet Points',
                description: 'Concise bullet-point summary',
                icon: '📝'
            },
            {
                id: 'flowchart',
                label: 'Flowchart',
                description: 'Visual flow explanation',
                icon: '📊'
            },
            {
                id: 'interview-prep',
                label: 'Interview Prep',
                description: 'Technical interview perspective',
                icon: '🎯'
            },
            {
                id: 'portfolio-pitch',
                label: 'Portfolio Pitch',
                description: 'Project summary for portfolio',
                icon: '💼'
            }
        ];
    }

    private initializeLanguagePatterns(): void {
        // JavaScript/TypeScript patterns
        this.languagePatterns.set('javascript', [
            /function\s+\w+\s*\([^)]*\)\s*\{/g,
            /const\s+\w+\s*=/g,
            /let\s+\w+\s*=/g,
            /var\s+\w+\s*=/g,
            /class\s+\w+/g,
            /=>\s*\{/g,
            /async\s+function/g,
            /await\s+/g,
            /Promise\./g
        ]);

        this.languagePatterns.set('typescript', [
            ...this.languagePatterns.get('javascript') || [],
            /interface\s+\w+/g,
            /type\s+\w+/g,
            /:\s*\w+/g,
            /<[^>]+>/g
        ]);

        // Python patterns
        this.languagePatterns.set('python', [
            /def\s+\w+\s*\([^)]*\)\s*:/g,
            /class\s+\w+/g,
            /import\s+/g,
            /from\s+\w+\s+import/g,
            /if\s+__name__\s*==\s*['"]__main__['"]/g,
            /async\s+def/g,
            /await\s+/g,
            /with\s+/g,
            /try\s*:/g,
            /except\s+/g
        ]);

        // Java patterns
        this.languagePatterns.set('java', [
            /public\s+class\s+\w+/g,
            /public\s+static\s+void\s+main/g,
            /private\s+\w+\s+\w+/g,
            /public\s+\w+\s+\w+/g,
            /interface\s+\w+/g,
            /implements\s+\w+/g,
            /extends\s+\w+/g,
            /new\s+\w+/g,
            /try\s*\{/g,
            /catch\s*\(/g
        ]);
    }

    async explainCode(code: string, languageId: string, mode: ExplanationMode = 'senior-engineer'): Promise<CodeExplanation> {
        const patterns = this.languagePatterns.get(languageId) || [];
        const detectedPatterns = patterns.filter(pattern => pattern.test(code));
        
        const complexity = this.assessComplexity(code, detectedPatterns.length);
        const concepts = this.extractConcepts(code, languageId);
        
        return {
            summary: this.generateSummary(code, languageId, concepts, mode),
            details: this.generateDetailedExplanation(code, languageId, concepts, mode),
            complexity,
            concepts,
            examples: this.generateExamples(code, languageId, mode),
            visualHint: this.generateVisualHint(code, languageId),
            explanationMode: mode,
            followUpQuestions: this.generateFollowUpQuestions(code, languageId),
            timeComplexity: this.analyzeTimeComplexity(code, languageId),
            optimizationTips: this.generateOptimizationTips(code, languageId),
            interviewQuestions: this.generateInterviewQuestions(code, languageId),
            resumeBullet: this.generateResumeBullet(code, languageId)
        };
    }

    async explainFunction(functionCode: string, languageId: string, mode: ExplanationMode = 'senior-engineer'): Promise<CodeExplanation> {
        const functionName = this.extractFunctionName(functionCode, languageId);
        const parameters = this.extractParameters(functionCode, languageId);
        const returnType = this.extractReturnType(functionCode, languageId);
        
        return {
            summary: this.generateFunctionSummary(functionName, parameters, returnType, mode),
            details: this.generateFunctionExplanation(functionCode, languageId, functionName, parameters, mode),
            complexity: this.assessComplexity(functionCode, 0),
            concepts: this.extractFunctionConcepts(functionCode, languageId),
            examples: this.generateFunctionExamples(functionCode, languageId, mode),
            explanationMode: mode,
            followUpQuestions: this.generateFunctionFollowUpQuestions(functionName, parameters),
            timeComplexity: this.analyzeFunctionTimeComplexity(functionCode, languageId),
            optimizationTips: this.generateFunctionOptimizationTips(functionCode, languageId),
            interviewQuestions: this.generateFunctionInterviewQuestions(functionName, parameters, returnType),
            resumeBullet: this.generateFunctionResumeBullet(functionName, parameters, returnType)
        };
    }

    async explainVariable(variableCode: string, languageId: string, mode: ExplanationMode = 'senior-engineer'): Promise<CodeExplanation> {
        const variableName = this.extractVariableName(variableCode, languageId);
        const variableType = this.extractVariableType(variableCode, languageId);
        const value = this.extractVariableValue(variableCode, languageId);
        
        return {
            summary: this.generateVariableSummary(variableName, variableType, value, mode),
            details: this.generateVariableExplanation(variableCode, languageId, variableName, variableType, value, mode),
            complexity: 'simple',
            concepts: this.extractVariableConcepts(variableCode, languageId),
            explanationMode: mode,
            followUpQuestions: this.generateVariableFollowUpQuestions(variableName, variableType)
        };
    }

    private generateSummary(code: string, languageId: string, concepts: string[], mode: ExplanationMode): string {
        const lines = code.split('\n').length;
        const conceptList = concepts.length > 0 ? ` Uses: ${concepts.join(', ')}` : '';
        
        switch (mode) {
            case 'explain-like-5':
                return `This is a ${lines}-line piece of code that does something cool! ${conceptList}`;
            case 'debug-step-by-step':
                return `Let's debug this ${lines}-line ${languageId} code step by step. ${conceptList}`;
            case 'why-approach':
                return `This ${lines}-line ${languageId} code uses specific patterns: ${conceptList}`;
            case 'interview-prep':
                return `In an interview, I'd explain this ${lines}-line ${languageId} code as: ${conceptList}`;
            case 'portfolio-pitch':
                return `This ${lines}-line ${languageId} code demonstrates: ${conceptList}`;
            default:
                return `This ${lines}-line ${languageId} code${conceptList}.`;
        }
    }

    private generateDetailedExplanation(code: string, languageId: string, concepts: string[], mode: ExplanationMode): string {
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        
        switch (mode) {
            case 'explain-like-5':
                return this.generateSimpleExplanation(lines, languageId);
            case 'debug-step-by-step':
                return this.generateDebugExplanation(lines, languageId);
            case 'why-approach':
                return this.generateApproachExplanation(lines, languageId, concepts);
            case 'bullet-points':
                return this.generateBulletPointExplanation(lines, languageId);
            case 'interview-prep':
                return this.generateInterviewExplanation(lines, languageId, concepts);
            case 'portfolio-pitch':
                return this.generatePortfolioExplanation(lines, languageId, concepts);
            case 'peer-reviewer':
                return this.generatePeerReviewExplanation(lines, languageId, concepts);
            case 'beginner-student':
                return this.generateBeginnerExplanation(lines, languageId);
            default:
                return this.generateDefaultDetailedExplanation(code, languageId, concepts);
        }
    }

    private generateDefaultDetailedExplanation(code: string, languageId: string, concepts: string[]): string {
        let explanation = `This ${languageId} code performs the following operations:\n\n`;
        
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.length > 0) {
                explanation += `${index + 1}. ${this.simplifyLineForKids(trimmedLine, languageId)}\n`;
            }
        });
        
        if (concepts.length > 0) {
            explanation += `\n**Key Concepts:** ${concepts.join(', ')}`;
        }
        
        return explanation;
    }

    private generateSimpleExplanation(lines: string[], languageId: string): string {
        let explanation = `Imagine this code is like a recipe! Here's what each step does:\n\n`;
        
        lines.forEach((line, index) => {
            const simpleLine = this.simplifyLineForKids(line.trim(), languageId);
            if (simpleLine) {
                explanation += `${index + 1}. ${simpleLine}\n`;
            }
        });
        
        return explanation;
    }

    private generateDebugExplanation(lines: string[], languageId: string): string {
        let explanation = `Let's debug this code step by step:\n\n`;
        
        lines.forEach((line, index) => {
            const debugLine = this.generateDebugStep(line.trim(), languageId, index);
            if (debugLine) {
                explanation += `Step ${index + 1}: ${debugLine}\n`;
            }
        });
        
        return explanation;
    }

    private generateApproachExplanation(lines: string[], languageId: string, concepts: string[]): string {
        let explanation = `This code uses specific approaches for good reasons:\n\n`;
        
        if (concepts.includes('Functions')) {
            explanation += `• **Functions**: Used to organize code into reusable blocks\n`;
        }
        if (concepts.includes('Loops')) {
            explanation += `• **Loops**: Used to repeat actions efficiently\n`;
        }
        if (concepts.includes('Conditional Logic')) {
            explanation += `• **Conditionals**: Used to make decisions based on data\n`;
        }
        if (concepts.includes('Object-Oriented Programming')) {
            explanation += `• **Classes**: Used to model real-world objects\n`;
        }
        if (concepts.includes('Asynchronous Programming')) {
            explanation += `• **Async/Await**: Used to handle operations that take time\n`;
        }
        
        explanation += `\n**Why these approaches?**\n`;
        explanation += `• **Maintainability**: Code is easier to understand and modify\n`;
        explanation += `• **Reusability**: Functions can be used multiple times\n`;
        explanation += `• **Performance**: Efficient algorithms and data structures\n`;
        explanation += `• **Readability**: Clear, self-documenting code\n`;
        
        return explanation;
    }

    private generateBulletPointExplanation(lines: string[], languageId: string): string {
        let explanation = `**Code Breakdown:**\n\n`;
        
        lines.forEach((line, index) => {
            const bulletPoint = this.generateBulletPoint(line.trim(), languageId);
            if (bulletPoint) {
                explanation += `• **Line ${index + 1}**: ${bulletPoint}\n`;
            }
        });
        
        return explanation;
    }

    private generateInterviewExplanation(lines: string[], languageId: string, concepts: string[]): string {
        let explanation = `**Interview Response:**\n\n`;
        explanation += `"This code demonstrates several important programming concepts:\n\n`;
        
        concepts.forEach(concept => {
            explanation += `• **${concept}**: Shows understanding of ${concept.toLowerCase()}\n`;
        });
        
        explanation += `\n**Key Points to Highlight:**\n`;
        explanation += `• Clean, readable code structure\n`;
        explanation += `• Proper error handling\n`;
        explanation += `• Efficient algorithm design\n`;
        explanation += `• Good naming conventions\n`;
        explanation += `• Scalable architecture\n`;
        
        return explanation;
    }

    private generatePortfolioExplanation(lines: string[], languageId: string, concepts: string[]): string {
        let explanation = `**Project Pitch:**\n\n`;
        explanation += `This code showcases my skills in:\n\n`;
        
        concepts.forEach(concept => {
            explanation += `• **${concept}**: Demonstrated through practical implementation\n`;
        });
        
        explanation += `\n**Technical Highlights:**\n`;
        explanation += `• ${lines.length} lines of clean, maintainable code\n`;
        explanation += `• Multiple programming paradigms\n`;
        explanation += `• Industry best practices\n`;
        explanation += `• Problem-solving approach\n`;
        
        return explanation;
    }

    private generatePeerReviewExplanation(lines: string[], languageId: string, concepts: string[]): string {
        let explanation = `**Peer Review Feedback:**\n\n`;
        explanation += `**Strengths:**\n`;
        explanation += `• Good code organization\n`;
        explanation += `• Clear variable naming\n`;
        explanation += `• Proper use of ${concepts.join(', ')}\n`;
        
        explanation += `\n**Suggestions for Improvement:**\n`;
        explanation += `• Consider adding more comments\n`;
        explanation += `• Could benefit from error handling\n`;
        explanation += `• Performance optimization opportunities\n`;
        
        explanation += `\n**Overall Assessment:** Solid implementation with room for enhancement.`;
        
        return explanation;
    }

    private generateBeginnerExplanation(lines: string[], languageId: string): string {
        let explanation = `**Beginner-Friendly Explanation:**\n\n`;
        explanation += `Let's break this down into simple concepts:\n\n`;
        
        lines.forEach((line, index) => {
            const beginnerLine = this.generateBeginnerStep(line.trim(), languageId);
            if (beginnerLine) {
                explanation += `**Line ${index + 1}**: ${beginnerLine}\n\n`;
            }
        });
        
        explanation += `**Learning Points:**\n`;
        explanation += `• Each line has a specific purpose\n`;
        explanation += `• Code is read from top to bottom\n`;
        explanation += `• Variables store information\n`;
        explanation += `• Functions perform actions\n`;
        
        return explanation;
    }

    private generateFollowUpQuestions(code: string, languageId: string): string[] {
        const questions = [
            "What does this part of the code do?",
            "Can this code be simplified?",
            "What are the potential edge cases?",
            "How would you test this code?",
            "What's the time complexity?",
            "Can this be optimized further?",
            "What happens if the input is invalid?",
            "How would you handle errors here?",
            "What's the memory usage?",
            "How would you refactor this?"
        ];
        
        return questions.slice(0, 5); // Return top 5 questions
    }

    private analyzeTimeComplexity(code: string, languageId: string): string {
        const lines = code.split('\n').length;
        
        if (code.includes('for') && code.includes('for')) {
            return 'O(n²) - Nested loops indicate quadratic time complexity';
        } else if (code.includes('for') || code.includes('while')) {
            return 'O(n) - Single loop indicates linear time complexity';
        } else if (code.includes('sort')) {
            return 'O(n log n) - Sorting operation';
        } else {
            return 'O(1) - Constant time complexity';
        }
    }

    private generateOptimizationTips(code: string, languageId: string): string[] {
        const tips = [];
        
        if (code.includes('for') && code.includes('for')) {
            tips.push('Consider using a hash map to reduce nested loops');
        }
        if (code.includes('var')) {
            tips.push('Use const/let instead of var for better scoping');
        }
        if (code.includes('console.log')) {
            tips.push('Remove console.log statements for production');
        }
        if (code.includes('function') && !code.includes('return')) {
            tips.push('Consider adding explicit return statements');
        }
        
        return tips.length > 0 ? tips : ['Code looks well-optimized'];
    }

    private generateInterviewQuestions(code: string, languageId: string): string[] {
        return [
            "Why did you choose this approach?",
            "What's the time complexity of this code?",
            "How would you handle edge cases?",
            "Can you explain this algorithm?",
            "What improvements would you suggest?",
            "How would you test this code?",
            "What are the trade-offs of this solution?",
            "How would you scale this for larger inputs?"
        ];
    }

    private generateResumeBullet(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        const lines = code.split('\n').length;
        
        if (concepts.includes('Functions')) {
            return `Developed ${lines}-line ${languageId} functions implementing ${concepts.join(', ')}`;
        } else if (concepts.includes('Object-Oriented Programming')) {
            return `Designed ${languageId} classes and objects using ${concepts.join(', ')}`;
        } else {
            return `Implemented ${lines}-line ${languageId} solution using ${concepts.join(', ')}`;
        }
    }

    private assessComplexity(code: string, patternCount: number): 'simple' | 'moderate' | 'complex' {
        const lines = code.split('\n').length;
        const characters = code.length;
        
        if (lines <= 5 && characters <= 200 && patternCount <= 2) {
            return 'simple';
        } else if (lines <= 20 && characters <= 500 && patternCount <= 5) {
            return 'moderate';
        } else {
            return 'complex';
        }
    }

    private extractConcepts(code: string, languageId: string): string[] {
        const concepts: string[] = [];
        
        // Basic programming concepts
        if (code.includes('if') || code.includes('else')) concepts.push('Conditional Logic');
        if (code.includes('for') || code.includes('while')) concepts.push('Loops');
        if (code.includes('function') || code.includes('def')) concepts.push('Functions');
        if (code.includes('class')) concepts.push('Object-Oriented Programming');
        if (code.includes('async') || code.includes('await')) concepts.push('Asynchronous Programming');
        if (code.includes('try') || code.includes('catch')) concepts.push('Error Handling');
        
        // Language-specific concepts
        if (languageId === 'javascript' || languageId === 'typescript') {
            if (code.includes('=>')) concepts.push('Arrow Functions');
            if (code.includes('const') || code.includes('let')) concepts.push('Block Scoping');
            if (code.includes('Promise')) concepts.push('Promises');
        }
        
        if (languageId === 'python') {
            if (code.includes('import')) concepts.push('Module Import');
            if (code.includes('with')) concepts.push('Context Managers');
            if (code.includes('__init__')) concepts.push('Class Initialization');
        }
        
        return concepts;
    }

    private generateExamples(code: string, languageId: string, mode: ExplanationMode): string[] {
        const examples: string[] = [];
        
        if (code.includes('function')) {
            examples.push('Call the function with appropriate parameters');
        }
        
        if (code.includes('class')) {
            examples.push('Create an instance of the class');
        }
        
        return examples;
    }

    private generateVisualHint(code: string, languageId: string): string {
        if (code.includes('function') || code.includes('def')) {
            return 'flowchart';
        } else if (code.includes('class')) {
            return 'classDiagram';
        } else if (code.includes('if') || code.includes('for')) {
            return 'flowchart';
        }
        return 'sequenceDiagram';
    }

    private extractFunctionName(functionCode: string, languageId: string): string {
        const patterns = {
            javascript: /function\s+(\w+)/,
            typescript: /function\s+(\w+)/,
            python: /def\s+(\w+)/,
            java: /(\w+)\s*\([^)]*\)\s*\{/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        const match = functionCode.match(pattern);
        return match ? match[1] : 'unknown';
    }

    private extractParameters(functionCode: string, languageId: string): string[] {
        const patterns = {
            javascript: /function\s+\w+\s*\(([^)]*)\)/,
            typescript: /function\s+\w+\s*\(([^)]*)\)/,
            python: /def\s+\w+\s*\(([^)]*)\)/,
            java: /(\w+)\s*\(([^)]*)\)\s*\{/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        const match = functionCode.match(pattern);
        
        if (!match) return [];
        
        const params = match[1] || match[2] || '';
        return params.split(',').map(p => p.trim()).filter(p => p.length > 0);
    }

    private extractReturnType(functionCode: string, languageId: string): string | null {
        if (languageId === 'typescript') {
            const match = functionCode.match(/:\s*(\w+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    private generateFunctionSummary(functionName: string, parameters: string[], returnType: string | null, mode: ExplanationMode): string {
        const paramList = parameters.join(', ') || 'none';
        const returnInfo = returnType ? ` -> ${returnType}` : '';
        
        switch (mode) {
            case 'explain-like-5':
                return `This function called "${functionName}" is like a helper that takes ${parameters.length} things and gives you something back!`;
            case 'interview-prep':
                return `Function ${functionName}(${paramList})${returnInfo} - ready for technical discussion`;
            case 'portfolio-pitch':
                return `Function ${functionName} demonstrates parameter handling and return value management`;
            default:
                return `Function ${functionName}(${paramList})${returnInfo}`;
        }
    }

    private generateFunctionExplanation(functionCode: string, languageId: string, functionName: string, parameters: string[], mode: ExplanationMode): string {
        switch (mode) {
            case 'explain-like-5':
                return `This function named "${functionName}" is like a recipe that takes ${parameters.length} ingredients (${parameters.join(', ')}) and cooks something for you!`;
            case 'interview-prep':
                return `This function ${functionName} demonstrates parameter handling, logic implementation, and return value management. Key points: parameter validation, error handling, and efficient algorithm design.`;
            default:
                return `This function named "${functionName}" takes ${parameters.length} parameter(s): ${parameters.join(', ')}. It performs specific operations and may return a value depending on the implementation.`;
        }
    }

    private extractFunctionConcepts(functionCode: string, languageId: string): string[] {
        const concepts: string[] = ['Functions'];
        
        if (functionCode.includes('async')) concepts.push('Asynchronous Programming');
        if (functionCode.includes('return')) concepts.push('Return Values');
        if (functionCode.includes('=>')) concepts.push('Arrow Functions');
        
        return concepts;
    }

    private generateFunctionExamples(functionCode: string, languageId: string, mode: ExplanationMode): string[] {
        const functionName = this.extractFunctionName(functionCode, languageId);
        const parameters = this.extractParameters(functionCode, languageId);
        
        if (parameters.length === 0) {
            return [`${functionName}()`];
        } else {
            return [`${functionName}(${parameters.map(p => 'value').join(', ')})`];
        }
    }

    private generateFunctionFollowUpQuestions(functionName: string, parameters: string[]): string[] {
        return [
            `What does the ${functionName} function do?`,
            `How would you test the ${functionName} function?`,
            `What happens if you pass invalid parameters to ${functionName}?`,
            `Can the ${functionName} function be optimized?`,
            `How would you document the ${functionName} function?`
        ];
    }

    private analyzeFunctionTimeComplexity(functionCode: string, languageId: string): string {
        if (functionCode.includes('for') && functionCode.includes('for')) {
            return 'O(n²) - Nested loops in function';
        } else if (functionCode.includes('for') || functionCode.includes('while')) {
            return 'O(n) - Single loop in function';
        } else {
            return 'O(1) - Constant time function';
        }
    }

    private generateFunctionOptimizationTips(functionCode: string, languageId: string): string[] {
        const tips = [];
        
        if (functionCode.includes('for') && functionCode.includes('for')) {
            tips.push('Consider using a hash map to reduce nested loops');
        }
        if (!functionCode.includes('return')) {
            tips.push('Add explicit return statements for clarity');
        }
        if (functionCode.includes('console.log')) {
            tips.push('Remove console.log statements for production');
        }
        
        return tips.length > 0 ? tips : ['Function is well-optimized'];
    }

    private generateFunctionInterviewQuestions(functionName: string, parameters: string[], returnType: string | null): string[] {
        return [
            `Why did you name this function ${functionName}?`,
            `What's the purpose of the ${parameters.join(', ')} parameters?`,
            `What does the function return and why?`,
            `How would you handle edge cases in ${functionName}?`,
            `What's the time complexity of ${functionName}?`,
            `How would you test ${functionName}?`,
            `Can ${functionName} be optimized further?`,
            `What are the trade-offs of this implementation?`
        ];
    }

    private generateFunctionResumeBullet(functionName: string, parameters: string[], returnType: string | null): string {
        return `Developed ${functionName} function handling ${parameters.length} parameters with ${returnType || 'void'} return type`;
    }

    private extractVariableName(variableCode: string, languageId: string): string {
        const patterns = {
            javascript: /(?:const|let|var)\s+(\w+)/,
            typescript: /(?:const|let|var)\s+(\w+)/,
            python: /(\w+)\s*=/,
            java: /(\w+)\s+\w+\s*=/
        };
        
        const pattern = patterns[languageId as keyof typeof patterns];
        const match = variableCode.match(pattern);
        return match ? match[1] : 'unknown';
    }

    private extractVariableType(variableCode: string, languageId: string): string | null {
        if (languageId === 'typescript') {
            const match = variableCode.match(/:\s*(\w+)/);
            return match ? match[1] : null;
        } else if (languageId === 'java') {
            const match = variableCode.match(/(\w+)\s+\w+\s*=/);
            return match ? match[1] : null;
        }
        return null;
    }

    private extractVariableValue(variableCode: string, languageId: string): string {
        const match = variableCode.match(/=\s*(.+)/);
        return match ? match[1].trim() : 'undefined';
    }

    private generateVariableSummary(variableName: string, variableType: string | null, value: string, mode: ExplanationMode): string {
        const typeInfo = variableType ? ` (${variableType})` : '';
        
        switch (mode) {
            case 'explain-like-5':
                return `This is like a box named "${variableName}" that holds ${value}!`;
            case 'interview-prep':
                return `Variable ${variableName}${typeInfo} = ${value} - demonstrates data storage`;
            default:
                return `Variable ${variableName}${typeInfo} = ${value}`;
        }
    }

    private generateVariableExplanation(variableCode: string, languageId: string, variableName: string, variableType: string | null, value: string, mode: ExplanationMode): string {
        switch (mode) {
            case 'explain-like-5':
                return `Think of "${variableName}" as a special box that keeps ${value} safe for later use!`;
            case 'interview-prep':
                return `This variable ${variableName} demonstrates proper naming conventions, type safety, and data initialization.`;
            default:
                return `This variable "${variableName}"${variableType ? ` of type ${variableType}` : ''} is assigned the value ${value}.`;
        }
    }

    private extractVariableConcepts(variableCode: string, languageId: string): string[] {
        const concepts: string[] = ['Variables'];
        
        if (variableCode.includes('const')) concepts.push('Constants');
        if (variableCode.includes('let')) concepts.push('Block Scoping');
        if (variableCode.includes('var')) concepts.push('Function Scoping');
        
        return concepts;
    }

    private generateVariableFollowUpQuestions(variableName: string, variableType: string | null): string[] {
        return [
            `What is the purpose of the ${variableName} variable?`,
            `Why did you choose ${variableType || 'this type'} for ${variableName}?`,
            `How is ${variableName} used in the code?`,
            `Could ${variableName} be made constant?`,
            `What happens if ${variableName} is undefined?`
        ];
    }

    // Helper methods for different explanation modes
    private simplifyLineForKids(line: string, languageId: string): string {
        if (line.includes('function') || line.includes('def')) {
            return 'This creates a new helper (like a recipe)';
        } else if (line.includes('if')) {
            return 'This checks if something is true (like checking if it\'s raining)';
        } else if (line.includes('for') || line.includes('while')) {
            return 'This repeats something many times (like counting)';
        } else if (line.includes('return')) {
            return 'This gives back an answer (like finishing a recipe)';
        } else if (line.includes('=')) {
            return 'This saves something in a box for later';
        } else if (line.includes('console.log') || line.includes('print')) {
            return 'This shows a message on the screen';
        } else {
            return 'This does something important';
        }
    }

    private generateDebugStep(line: string, languageId: string, stepNumber: number): string {
        if (line.includes('function') || line.includes('def')) {
            return `Define function - creates a new function scope`;
        } else if (line.includes('if')) {
            return `Check condition - evaluates if statement`;
        } else if (line.includes('for') || line.includes('while')) {
            return `Start loop - begins iteration`;
        } else if (line.includes('return')) {
            return `Return value - exits function with result`;
        } else if (line.includes('=')) {
            return `Assign value - stores data in variable`;
        } else if (line.includes('console.log') || line.includes('print')) {
            return `Output result - displays information`;
        } else {
            return `Execute code - runs the instruction`;
        }
    }

    private generateBulletPoint(line: string, languageId: string): string {
        if (line.includes('function') || line.includes('def')) {
            return 'Defines a new function';
        } else if (line.includes('if')) {
            return 'Implements conditional logic';
        } else if (line.includes('for') || line.includes('while')) {
            return 'Creates a loop structure';
        } else if (line.includes('return')) {
            return 'Returns a value from function';
        } else if (line.includes('=')) {
            return 'Assigns a value to variable';
        } else if (line.includes('console.log') || line.includes('print')) {
            return 'Outputs information to console';
        } else {
            return 'Executes program logic';
        }
    }

    private generateBeginnerStep(line: string, languageId: string): string {
        if (line.includes('function') || line.includes('def')) {
            return 'This line creates a new function. Functions are like reusable blocks of code that can be called multiple times.';
        } else if (line.includes('if')) {
            return 'This line checks a condition. If the condition is true, the code inside the if block will run.';
        } else if (line.includes('for') || line.includes('while')) {
            return 'This line creates a loop. Loops repeat code multiple times until a condition is met.';
        } else if (line.includes('return')) {
            return 'This line sends a value back from the function. It\'s like the function\'s answer.';
        } else if (line.includes('=')) {
            return 'This line assigns a value to a variable. Variables are like containers that store data.';
        } else if (line.includes('console.log') || line.includes('print')) {
            return 'This line displays information on the screen. It\'s useful for debugging and seeing what your code is doing.';
        } else {
            return 'This line contains code that performs a specific action in your program.';
        }
    }
} 