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
            description: 'Ultra-simple explanation using everyday analogies',
            icon: '👶',
            prompt: 'Explain this code as if I\'m 5 years old, using simple words and everyday examples'
        },
        {
            id: 'step-by-step',
            label: 'Step-by-Step Breakdown',
            description: 'Split code into logical chunks and explain each step',
            icon: '🔍',
            prompt: 'Break down this code into logical chunks and explain each step clearly'
        },
        {
            id: 'whats-next',
            label: 'What\'s Next?',
            description: 'Suggest related concepts and what to learn next',
            icon: '🚀',
            prompt: 'Based on this code, suggest related concepts and what to learn next'
        },
        {
            id: 'debug-insight',
            label: 'Debug Insight',
            description: 'Highlight possible errors and debugging tips',
            icon: '🐛',
            prompt: 'Analyze this code for potential issues and debugging insights'
        },
        {
            id: 'learning-mode',
            label: 'Learning Mode',
            description: 'Step-by-step explanation with code snippets',
            icon: '🎓',
            prompt: 'Explain this code step-by-step as if teaching a beginner, breaking down each part'
        },
        {
            id: 'interview-mode',
            label: 'Interview Mode',
            description: 'Explain as if answering a technical interview question',
            icon: '🎯',
            prompt: 'Explain this code as if you\'re in a technical interview - cover time complexity, design decisions, and potential improvements'
        },
        {
            id: 'project-idea',
            label: 'Generate Project Idea',
            description: 'Create a project idea based on this code',
            icon: '💡',
            prompt: 'Based on this code, suggest a complete project idea that builds upon these concepts'
        },
        {
            id: 'mcq-generator',
            label: 'MCQ Generator',
            description: 'Turn this code into quiz questions',
            icon: '❓',
            prompt: 'Create multiple choice questions based on the concepts in this code'
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
                return this.generateExplainLike5(code, languageId);
            case 'learning-mode':
                return this.generateLearningModeExplanation(code, languageId);
            case 'interview-mode':
                return this.generateInterviewExplanation(code, languageId);
            case 'project-idea':
                return this.generateProjectIdea(code, languageId);
            case 'mcq-generator':
                return this.generateMCQs(code, languageId);
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
        const questions: string[] = [];
        
        if (code.includes('function')) {
            questions.push('How would you optimize this function for better performance?');
            questions.push('What are the potential edge cases for this function?');
        }
        if (code.includes('for')) {
            questions.push('What is the time complexity of this algorithm?');
            questions.push('How would you handle very large datasets?');
        }
        if (code.includes('if')) {
            questions.push('How would you make this code more maintainable?');
            questions.push('What alternative approaches could you use?');
        }
        
        questions.push('How would you test this code?');
        questions.push('What improvements would you suggest for production use?');
        
        return questions;
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

    private simplifyCodeForKids(code: string, languageId: string): string {
        const lines = code.split('\n').filter(line => line.trim());
        let explanation = '';
        
        lines.forEach((line, index) => {
            if (line.trim()) {
                explanation += `${index + 1}. ${this.simplifyLineForKids(line.trim(), languageId)}\n`;
            }
        });
        
        return explanation;
    }

    private explainLine(line: string, languageId: string): string {
        if (line.includes('function') || line.includes('def')) {
            return 'Function Definition';
        } else if (line.includes('if')) {
            return 'Conditional Check';
        } else if (line.includes('for') || line.includes('while')) {
            return 'Loop Structure';
        } else if (line.includes('return')) {
            return 'Return Statement';
        } else if (line.includes('=')) {
            return 'Variable Assignment';
        } else if (line.includes('console.log') || line.includes('print')) {
            return 'Output Statement';
        } else {
            return 'Code Execution';
        }
    }

    private getLineExplanation(line: string, languageId: string): string {
        if (line.includes('function') || line.includes('def')) {
            return 'Creates a new function that can be called multiple times';
        } else if (line.includes('if')) {
            return 'Checks if a condition is true and executes code if it is';
        } else if (line.includes('for') || line.includes('while')) {
            return 'Repeats a block of code multiple times';
        } else if (line.includes('return')) {
            return 'Sends a value back from the function';
        } else if (line.includes('=')) {
            return 'Stores a value in a variable for later use';
        } else if (line.includes('console.log') || line.includes('print')) {
            return 'Displays information on the screen';
        } else {
            return 'Executes a specific instruction in the program';
        }
    }

    private getConceptExplanation(concept: string): string {
        const explanations: { [key: string]: string } = {
            'Functions': 'Reusable blocks of code that perform specific tasks',
            'Variables': 'Containers that store data and values',
            'Loops': 'Structures that repeat code multiple times',
            'Conditional Logic': 'Code that makes decisions based on conditions',
            'Object-Oriented Programming': 'Programming paradigm using objects and classes',
            'Asynchronous Programming': 'Code that can run in the background',
            'Error Handling': 'Code that deals with unexpected situations'
        };
        return explanations[concept] || 'Important programming concept';
    }

    private getCodeOverview(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        const lines = code.split('\n').filter(line => line.trim()).length;
        
        let overview = `This code is ${lines} lines long and demonstrates the following concepts:\n\n`;
        concepts.forEach(concept => {
            overview += `- **${concept}**: ${this.getConceptExplanation(concept)}\n`;
        });
        
        return overview;
    }



    private analyzeDesignDecisions(code: string, languageId: string): string {
        let analysis = '**Key Design Decisions:**\n\n';
        
        if (code.includes('function')) {
            analysis += '- **Function Decomposition**: Code is broken into smaller, reusable functions\n';
        }
        if (code.includes('const') || code.includes('let')) {
            analysis += '- **Variable Declaration**: Using modern variable declaration for better scoping\n';
        }
        if (code.includes('if') && code.includes('else')) {
            analysis += '- **Conditional Logic**: Proper handling of different scenarios\n';
        }
        
        analysis += '- **Readability**: Code is written for human understanding\n';
        analysis += '- **Maintainability**: Structure allows for easy modifications\n';
        
        return analysis;
    }

    private generateTestingConsiderations(code: string, languageId: string): string {
        let testing = '**Testing Strategy:**\n\n';
        
        if (code.includes('function')) {
            testing += '- **Unit Tests**: Test each function with various inputs\n';
        }
        if (code.includes('if')) {
            testing += '- **Edge Cases**: Test boundary conditions and edge cases\n';
        }
        if (code.includes('for')) {
            testing += '- **Loop Testing**: Test with empty arrays and single elements\n';
        }
        
        testing += '- **Integration Tests**: Test how components work together\n';
        testing += '- **Performance Tests**: Ensure code meets performance requirements\n';
        
        return testing;
    }

    private createMCQs(concepts: string[]): Array<{question: string, options: string[], correctAnswer: number, explanation: string}> {
        const mcqs: Array<{question: string, options: string[], correctAnswer: number, explanation: string}> = [];
        
        if (concepts.includes('Functions')) {
            mcqs.push({
                question: 'What is the main purpose of functions in programming?',
                options: [
                    'To make code longer',
                    'To organize and reuse code',
                    'To slow down execution',
                    'To create errors'
                ],
                correctAnswer: 1,
                explanation: 'Functions help organize code into reusable blocks that can be called multiple times.'
            });
        }
        
        if (concepts.includes('Loops')) {
            mcqs.push({
                question: 'Which type of loop is best for iterating over arrays?',
                options: [
                    'while loop',
                    'for loop',
                    'do-while loop',
                    'if statement'
                ],
                correctAnswer: 1,
                explanation: 'For loops are ideal for arrays because you know the number of iterations.'
            });
        }
        
        if (concepts.includes('Conditional Logic')) {
            mcqs.push({
                question: 'What does an if statement do?',
                options: [
                    'Repeats code multiple times',
                    'Makes decisions based on conditions',
                    'Stores data in variables',
                    'Creates functions'
                ],
                correctAnswer: 1,
                explanation: 'If statements make decisions by checking if conditions are true or false.'
            });
        }
        
        if (concepts.includes('Variables')) {
            mcqs.push({
                question: 'What is a variable in programming?',
                options: [
                    'A type of function',
                    'A container that stores data',
                    'A loop structure',
                    'A conditional statement'
                ],
                correctAnswer: 1,
                explanation: 'Variables are containers that store data and values for later use.'
            });
        }
        
        return mcqs;
    }

    private generateDefaultExplanation(code: string, languageId: string): string {
        return `# 📝 Code Explanation\n\nThis code demonstrates various programming concepts and best practices.`;
    }

    private generateExplainLike5(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        let explanation = `# 👶 Explain Like I'm 5\n\n`;

        if (concepts.includes('Functions')) {
            explanation += `## 🏠 Think of this like a recipe!\n\n`;
            explanation += `Just like how a recipe tells you step-by-step how to make cookies, this code tells the computer step-by-step what to do.\n\n`;
        }

        if (concepts.includes('Variables')) {
            explanation += `## 📦 Variables are like boxes!\n\n`;
            explanation += `Imagine you have different boxes where you put your toys. Each box has a name (like "my favorite toy") and you can put different things inside it.\n\n`;
        }

        if (concepts.includes('Loops')) {
            explanation += `## 🔄 Loops are like repeating something!\n\n`;
            explanation += `If you had to count all your toys, you wouldn't say "1, 2, 3, 4, 5" one by one. You'd count them all at once. That's what a loop does!\n\n`;
        }

        if (concepts.includes('Conditional Logic')) {
            explanation += `## 🤔 If statements are like making decisions!\n\n`;
            explanation += `Just like you decide "If it's raining, I'll take an umbrella", the computer makes decisions too!\n\n`;
        }

        explanation += `## 📝 What this code does:\n\n`;
        explanation += this.simplifyCodeForKids(code, languageId);

        return explanation;
    }

    private generateLearningModeExplanation(code: string, languageId: string): string {
        const lines = code.split('\n').filter(line => line.trim());
        let explanation = `# 🎓 Learning Mode: Step-by-Step Explanation\n\n`;

        explanation += `Let's break down this code line by line:\n\n`;

        lines.forEach((line, index) => {
            if (line.trim()) {
                explanation += `### Step ${index + 1}: ${this.explainLine(line, languageId)}\n\n`;
                explanation += `**Code:** \`${line.trim()}\`\n\n`;
                explanation += `**What it does:** ${this.getLineExplanation(line, languageId)}\n\n`;
                explanation += `---\n\n`;
            }
        });

        explanation += `## 🎯 Key Concepts You Learned:\n\n`;
        const concepts = this.extractConcepts(code, languageId);
        concepts.forEach(concept => {
            explanation += `- **${concept}**: ${this.getConceptExplanation(concept)}\n`;
        });

        return explanation;
    }

    private generateInterviewExplanation(code: string, languageId: string): string {
        let explanation = `# 🎯 Interview Mode: Technical Deep Dive\n\n`;

        explanation += `## 📋 Code Overview\n\n`;
        explanation += `${this.getCodeOverview(code, languageId)}\n\n`;

        explanation += `## ⏱️ Time Complexity Analysis\n\n`;
        explanation += `${this.generateTimeComplexity(code, languageId)}\n\n`;

        explanation += `## 🏗️ Design Decisions\n\n`;
        explanation += `${this.analyzeDesignDecisions(code, languageId)}\n\n`;

        explanation += `## 🔧 Potential Improvements\n\n`;
        explanation += `${this.generateOptimizationTips(code, languageId)}\n\n`;

        explanation += `## 🧪 Testing Considerations\n\n`;
        explanation += `${this.generateTestingConsiderations(code, languageId)}\n\n`;

        explanation += `## 💡 Follow-up Questions You Might Get\n\n`;
        const questions = this.generateInterviewQuestions(code, languageId);
        questions.forEach((q, index) => {
            explanation += `${index + 1}. ${q}\n`;
        });

        return explanation;
    }

    private generateProjectIdea(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        let projectIdea = `# 💡 Project Idea Generator\n\n`;

        projectIdea += `## 🎯 Based on your code, here's a project idea:\n\n`;

        if (concepts.includes('Functions') && concepts.includes('Loops')) {
            projectIdea += `### 📊 Data Analysis Dashboard\n\n`;
            projectIdea += `**Concept:** Build a web dashboard that processes and visualizes data\n\n`;
            projectIdea += `**What you'll learn:**\n`;
            projectIdea += `- Function organization and reusability\n`;
            projectIdea += `- Data processing with loops\n`;
            projectIdea += `- User interface design\n`;
            projectIdea += `- Data visualization\n\n`;
        } else if (concepts.includes('Conditional Logic')) {
            projectIdea += `### 🎮 Simple Game\n\n`;
            projectIdea += `**Concept:** Create a text-based adventure game\n\n`;
            projectIdea += `**What you'll learn:**\n`;
            projectIdea += `- Decision-making logic\n`;
            projectIdea += `- User input handling\n`;
            projectIdea += `- Game state management\n`;
            projectIdea += `- User experience design\n\n`;
        } else if (concepts.includes('Variables')) {
            projectIdea += `### 📝 Personal Task Manager\n\n`;
            projectIdea += `**Concept:** Build a simple task management app\n\n`;
            projectIdea += `**What you'll learn:**\n`;
            projectIdea += `- Data storage and retrieval\n`;
            projectIdea += `- User interface design\n`;
            projectIdea += `- Data persistence\n`;
            projectIdea += `- User interaction patterns\n\n`;
        }

        projectIdea += `## 🚀 Next Steps:\n\n`;
        projectIdea += `1. **Plan your project structure**\n`;
        projectIdea += `2. **Break it into smaller tasks**\n`;
        projectIdea += `3. **Start with a simple prototype**\n`;
        projectIdea += `4. **Add features incrementally**\n`;
        projectIdea += `5. **Test and refine**\n\n`;

        projectIdea += `## 📚 Learning Resources:\n\n`;
        projectIdea += `- [MDN Web Docs](https://developer.mozilla.org/)\n`;
        projectIdea += `- [freeCodeCamp](https://www.freecodecamp.org/)\n`;
        projectIdea += `- [The Odin Project](https://www.theodinproject.com/)\n`;

        return projectIdea;
    }

    private generateMCQs(code: string, languageId: string): string {
        const concepts = this.extractConcepts(code, languageId);
        let mcqs = `# ❓ MCQ Generator\n\n`;
        mcqs += `## 📝 Quiz Questions Based on Your Code\n\n`;

        const questions = this.createMCQs(concepts);
        questions.forEach((q, index) => {
            mcqs += `### Question ${index + 1}\n\n`;
            mcqs += `**${q.question}**\n\n`;
            q.options.forEach((option, optIndex) => {
                mcqs += `${optIndex + 1}. ${option}\n`;
            });
            mcqs += `\n**Answer:** ${q.correctAnswer + 1}\n\n`;
            mcqs += `**Explanation:** ${q.explanation}\n\n`;
            mcqs += `---\n\n`;
        });

        return mcqs;
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
} 