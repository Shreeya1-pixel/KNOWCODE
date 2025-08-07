import * as vscode from 'vscode';

export interface ExplanationMode {
    id: string;
    label: string;
    description: string;
    icon: string;
    prompt: string;
}

export interface AIComment {
    line: number;
    comment: string;
    type: 'explanation' | 'warning' | 'tip' | 'question';
}

export interface LearningMode {
    enabled: boolean;
    pauseAfterSteps: boolean;
    showMCQs: boolean;
    showFlashcards: boolean;
}

export interface FollowUpQuestion {
    question: string;
    category: 'understanding' | 'optimization' | 'testing' | 'interview' | 'general';
}

export class EnhancedExplainer {
    private readonly explanationModes: ExplanationMode[] = [
        {
            id: 'explain-like-5',
            label: 'Explain like I\'m 5',
            description: 'Simple, easy-to-understand explanation',
            icon: '👶',
            prompt: 'Explain this code as if I\'m 5 years old'
        },
        {
            id: 'debug-step-by-step',
            label: 'Debug step-by-step',
            description: 'Walk through the code execution',
            icon: '🐛',
            prompt: 'Debug this code step by step'
        },
        {
            id: 'why-approach',
            label: 'Why this approach?',
            description: 'Explain the design decisions',
            icon: '🤔',
            prompt: 'Why was this approach used?'
        },
        {
            id: 'senior-engineer',
            label: 'Senior Engineer View',
            description: 'Professional code review perspective',
            icon: '👨‍💻',
            prompt: 'Explain as a senior engineer would'
        },
        {
            id: 'peer-reviewer',
            label: 'Peer Review',
            description: 'Code review feedback',
            icon: '👥',
            prompt: 'Review this code as a peer reviewer'
        },
        {
            id: 'beginner-student',
            label: 'Beginner Student',
            description: 'Educational explanation',
            icon: '📚',
            prompt: 'Explain for a beginner student'
        },
        {
            id: 'bullet-points',
            label: 'Bullet Points',
            description: 'Concise bullet-point summary',
            icon: '📝',
            prompt: 'Explain in bullet points'
        },
        {
            id: 'flowchart',
            label: 'Flowchart',
            description: 'Visual flow explanation',
            icon: '📊',
            prompt: 'Create a flowchart explanation'
        },
        {
            id: 'interview-prep',
            label: 'Interview Prep',
            description: 'Technical interview perspective',
            icon: '🎯',
            prompt: 'Explain as if in a technical interview'
        },
        {
            id: 'portfolio-pitch',
            label: 'Portfolio Pitch',
            description: 'Project summary for portfolio',
            icon: '💼',
            prompt: 'Summarize as a project pitch'
        }
    ];

    getExplanationModes(): ExplanationMode[] {
        return this.explanationModes;
    }

    generateExplanation(code: string, languageId: string, modeId: string): string {
        const mode = this.explanationModes.find(m => m.id === modeId);
        if (!mode) {
            return this.generateDefaultExplanation(code, languageId);
        }

        switch (modeId) {
            case 'explain-like-5':
                return this.generateSimpleExplanation(code, languageId);
            case 'debug-step-by-step':
                return this.generateDebugExplanation(code, languageId);
            case 'why-approach':
                return this.generateApproachExplanation(code, languageId);
            case 'senior-engineer':
                return this.generateSeniorEngineerExplanation(code, languageId);
            case 'peer-reviewer':
                return this.generatePeerReviewExplanation(code, languageId);
            case 'beginner-student':
                return this.generateBeginnerExplanation(code, languageId);
            case 'bullet-points':
                return this.generateBulletPointExplanation(code, languageId);
            case 'flowchart':
                return this.generateFlowchartExplanation(code, languageId);
            case 'interview-prep':
                return this.generateInterviewExplanation(code, languageId);
            case 'portfolio-pitch':
                return this.generatePortfolioExplanation(code, languageId);
            default:
                return this.generateDefaultExplanation(code, languageId);
        }
    }

    generateAIComments(code: string, languageId: string): AIComment[] {
        const lines = code.split('\n');
        const comments: AIComment[] = [];

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.length === 0) return;

            // Generate comments based on code patterns
            if (trimmedLine.includes('function') || trimmedLine.includes('def')) {
                comments.push({
                    line: index + 1,
                    comment: 'Function definition - reusable code block',
                    type: 'explanation'
                });
            } else if (trimmedLine.includes('if')) {
                comments.push({
                    line: index + 1,
                    comment: 'Conditional check - decision point',
                    type: 'explanation'
                });
            } else if (trimmedLine.includes('for') || trimmedLine.includes('while')) {
                comments.push({
                    line: index + 1,
                    comment: 'Loop - repeats code multiple times',
                    type: 'explanation'
                });
            } else if (trimmedLine.includes('return')) {
                comments.push({
                    line: index + 1,
                    comment: 'Return statement - sends value back',
                    type: 'explanation'
                });
            } else if (trimmedLine.includes('console.log') || trimmedLine.includes('print')) {
                comments.push({
                    line: index + 1,
                    comment: 'Debug output - remove for production',
                    type: 'warning'
                });
            } else if (trimmedLine.includes('var ')) {
                comments.push({
                    line: index + 1,
                    comment: 'Consider using const/let instead of var',
                    type: 'tip'
                });
            }
        });

        return comments;
    }

    generateFollowUpQuestions(code: string, languageId: string): FollowUpQuestion[] {
        const questions: FollowUpQuestion[] = [
            {
                question: 'What does this part of the code do?',
                category: 'understanding'
            },
            {
                question: 'Can this code be simplified?',
                category: 'optimization'
            },
            {
                question: 'What are the potential edge cases?',
                category: 'testing'
            },
            {
                question: 'How would you test this code?',
                category: 'testing'
            },
            {
                question: 'What\'s the time complexity?',
                category: 'interview'
            },
            {
                question: 'Can this be optimized further?',
                category: 'optimization'
            },
            {
                question: 'What happens if the input is invalid?',
                category: 'testing'
            },
            {
                question: 'How would you handle errors here?',
                category: 'understanding'
            },
            {
                question: 'What\'s the memory usage?',
                category: 'interview'
            },
            {
                question: 'How would you refactor this?',
                category: 'optimization'
            }
        ];

        return questions.slice(0, 5); // Return top 5 questions
    }

    generateInterviewQuestions(code: string, languageId: string): string[] {
        return [
            'Why did you choose this approach?',
            'What\'s the time complexity of this code?',
            'How would you handle edge cases?',
            'Can you explain this algorithm?',
            'What improvements would you suggest?',
            'How would you test this code?',
            'What are the trade-offs of this solution?',
            'How would you scale this for larger inputs?'
        ];
    }

    generateResumeBullet(code: string, languageId: string): string {
        const lines = code.split('\n').length;
        const concepts = this.extractConcepts(code, languageId);
        
        if (concepts.includes('Functions')) {
            return `Developed ${lines}-line ${languageId} functions implementing ${concepts.join(', ')}`;
        } else if (concepts.includes('Object-Oriented Programming')) {
            return `Designed ${languageId} classes and objects using ${concepts.join(', ')}`;
        } else {
            return `Implemented ${lines}-line ${languageId} solution using ${concepts.join(', ')}`;
        }
    }

    generateTimeComplexity(code: string, languageId: string): string {
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

    generateOptimizationTips(code: string, languageId: string): string[] {
        const tips: string[] = [];
        
        if (code.includes('for') && code.includes('for')) {
            tips.push('Consider using a hash map to reduce nested loops');
        }
        if (code.includes('var ')) {
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

    // Private helper methods
    private generateDefaultExplanation(code: string, languageId: string): string {
        const lines = code.split('\n').length;
        return `This ${lines}-line ${languageId} code performs various operations.`;
    }

    private generateSimpleExplanation(code: string, languageId: string): string {
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        let explanation = 'Imagine this code is like a recipe! Here\'s what each step does:\n\n';
        
        lines.forEach((line, index) => {
            const simpleLine = this.simplifyLineForKids(line.trim(), languageId);
            if (simpleLine) {
                explanation += `${index + 1}. ${simpleLine}\n`;
            }
        });
        
        return explanation;
    }

    private generateDebugExplanation(code: string, languageId: string): string {
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        let explanation = 'Let\'s debug this code step by step:\n\n';
        
        lines.forEach((line, index) => {
            const debugLine = this.generateDebugStep(line.trim(), languageId);
            if (debugLine) {
                explanation += `Step ${index + 1}: ${debugLine}\n`;
            }
        });
        
        return explanation;
    }

    private generateApproachExplanation(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        let explanation = 'This code uses specific approaches for good reasons:\n\n';
        
        concepts.forEach(concept => {
            explanation += `• **${concept}**: Used for better code organization and efficiency\n`;
        });
        
        explanation += '\n**Why these approaches?**\n';
        explanation += '• **Maintainability**: Code is easier to understand and modify\n';
        explanation += '• **Reusability**: Functions can be used multiple times\n';
        explanation += '• **Performance**: Efficient algorithms and data structures\n';
        explanation += '• **Readability**: Clear, self-documenting code\n';
        
        return explanation;
    }

    private generateSeniorEngineerExplanation(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        let explanation = '**Senior Engineer Perspective:**\n\n';
        explanation += 'This code demonstrates several important programming principles:\n\n';
        
        concepts.forEach(concept => {
            explanation += `• **${concept}**: Proper implementation showing industry best practices\n`;
        });
        
        explanation += '\n**Key Strengths:**\n';
        explanation += '• Clean, readable code structure\n';
        explanation += '• Proper separation of concerns\n';
        explanation += '• Efficient algorithm design\n';
        explanation += '• Good naming conventions\n';
        
        return explanation;
    }

    private generatePeerReviewExplanation(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        let explanation = '**Peer Review Feedback:**\n\n';
        explanation += '**Strengths:**\n';
        explanation += '• Good code organization\n';
        explanation += '• Clear variable naming\n';
        explanation += `• Proper use of ${concepts.join(', ')}\n`;
        
        explanation += '\n**Suggestions for Improvement:**\n';
        explanation += '• Consider adding more comments\n';
        explanation += '• Could benefit from error handling\n';
        explanation += '• Performance optimization opportunities\n';
        
        explanation += '\n**Overall Assessment:** Solid implementation with room for enhancement.';
        
        return explanation;
    }

    private generateBeginnerExplanation(code: string, languageId: string): string {
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        let explanation = '**Beginner-Friendly Explanation:**\n\n';
        explanation += 'Let\'s break this down into simple concepts:\n\n';
        
        lines.forEach((line, index) => {
            const beginnerLine = this.generateBeginnerStep(line.trim(), languageId);
            if (beginnerLine) {
                explanation += `**Line ${index + 1}**: ${beginnerLine}\n\n`;
            }
        });
        
        explanation += '**Learning Points:**\n';
        explanation += '• Each line has a specific purpose\n';
        explanation += '• Code is read from top to bottom\n';
        explanation += '• Variables store information\n';
        explanation += '• Functions perform actions\n';
        
        return explanation;
    }

    private generateBulletPointExplanation(code: string, languageId: string): string {
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        let explanation = '**Code Breakdown:**\n\n';
        
        lines.forEach((line, index) => {
            const bulletPoint = this.generateBulletPoint(line.trim(), languageId);
            if (bulletPoint) {
                explanation += `• **Line ${index + 1}**: ${bulletPoint}\n`;
            }
        });
        
        return explanation;
    }

    private generateFlowchartExplanation(code: string, languageId: string): string {
        return '**Flowchart Explanation:**\n\nThis code can be visualized as a flowchart showing the program flow and decision points.';
    }

    private generateInterviewExplanation(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        let explanation = '**Interview Response:**\n\n';
        explanation += '"This code demonstrates several important programming concepts:\n\n';
        
        concepts.forEach(concept => {
            explanation += `• **${concept}**: Shows understanding of ${concept.toLowerCase()}\n`;
        });
        
        explanation += '\n**Key Points to Highlight:**\n';
        explanation += '• Clean, readable code structure\n';
        explanation += '• Proper error handling\n';
        explanation += '• Efficient algorithm design\n';
        explanation += '• Good naming conventions\n';
        explanation += '• Scalable architecture\n';
        
        return explanation;
    }

    private generatePortfolioExplanation(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        const lines = code.split('\n').length;
        let explanation = '**Project Pitch:**\n\n';
        explanation += 'This code showcases my skills in:\n\n';
        
        concepts.forEach(concept => {
            explanation += `• **${concept}**: Demonstrated through practical implementation\n`;
        });
        
        explanation += '\n**Technical Highlights:**\n';
        explanation += `• ${lines} lines of clean, maintainable code\n`;
        explanation += '• Multiple programming paradigms\n';
        explanation += '• Industry best practices\n';
        explanation += '• Problem-solving approach\n';
        
        return explanation;
    }

    private extractConcepts(code: string, languageId: string): string[] {
        const concepts: string[] = [];
        
        if (code.includes('if') || code.includes('else')) concepts.push('Conditional Logic');
        if (code.includes('for') || code.includes('while')) concepts.push('Loops');
        if (code.includes('function') || code.includes('def')) concepts.push('Functions');
        if (code.includes('class')) concepts.push('Object-Oriented Programming');
        if (code.includes('async') || code.includes('await')) concepts.push('Asynchronous Programming');
        if (code.includes('try') || code.includes('catch')) concepts.push('Error Handling');
        
        return concepts;
    }

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

    private generateDebugStep(line: string, languageId: string): string {
        if (line.includes('function') || line.includes('def')) {
            return 'Define function - creates a new function scope';
        } else if (line.includes('if')) {
            return 'Check condition - evaluates if statement';
        } else if (line.includes('for') || line.includes('while')) {
            return 'Start loop - begins iteration';
        } else if (line.includes('return')) {
            return 'Return value - exits function with result';
        } else if (line.includes('=')) {
            return 'Assign value - stores data in variable';
        } else if (line.includes('console.log') || line.includes('print')) {
            return 'Output result - displays information';
        } else {
            return 'Execute code - runs the instruction';
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