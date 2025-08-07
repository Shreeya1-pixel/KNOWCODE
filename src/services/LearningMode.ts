import * as vscode from 'vscode';

export interface MCQ {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
}

export interface Flashcard {
    front: string;
    back: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface LearningStep {
    stepNumber: number;
    title: string;
    description: string;
    codeSnippet?: string;
    explanation: string;
    pauseAfter?: boolean;
}

export interface ProjectIdea {
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    technologies: string[];
    learningOutcomes: string[];
    resources: string[];
}

export class LearningMode {
    private isEnabled: boolean = false;
    private currentStep: number = 0;
    private learningSteps: LearningStep[] = [];

    toggleLearningMode(): boolean {
        this.isEnabled = !this.isEnabled;
        if (this.isEnabled) {
            vscode.window.showInformationMessage('🎓 Learning Mode Enabled! KNOWCODE will guide you through code concepts.');
        } else {
            vscode.window.showInformationMessage('Learning Mode Disabled.');
        }
        return this.isEnabled;
    }

    isLearningModeEnabled(): boolean {
        return this.isEnabled;
    }

    generateMCQs(code: string, languageId: string): MCQ[] {
        const concepts = this.extractConcepts(code, languageId);
        const mcqs: MCQ[] = [];

        // Generate MCQs based on detected concepts
        if (concepts.includes('Functions')) {
            mcqs.push({
                question: 'What is the purpose of a function in programming?',
                options: [
                    'To store data',
                    'To organize and reuse code',
                    'To create variables',
                    'To display output'
                ],
                correctAnswer: 1,
                explanation: 'Functions are used to organize code into reusable blocks that can be called multiple times.',
                category: 'Functions'
            });
        }

        if (concepts.includes('Loops')) {
            mcqs.push({
                question: 'Which loop type is best for iterating over arrays?',
                options: [
                    'while loop',
                    'for loop',
                    'do-while loop',
                    'if statement'
                ],
                correctAnswer: 1,
                explanation: 'For loops are ideal for iterating over arrays because you know the number of iterations.',
                category: 'Loops'
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
                explanation: 'If statements make decisions by checking if conditions are true or false.',
                category: 'Conditional Logic'
            });
        }

        if (concepts.includes('Object-Oriented Programming')) {
            mcqs.push({
                question: 'What is the main benefit of using classes?',
                options: [
                    'Faster execution',
                    'Better memory usage',
                    'Code organization and reusability',
                    'Smaller file size'
                ],
                correctAnswer: 2,
                explanation: 'Classes help organize code by grouping related data and methods together.',
                category: 'Object-Oriented Programming'
            });
        }

        return mcqs;
    }

    generateFlashcards(code: string, languageId: string): Flashcard[] {
        const concepts = this.extractConcepts(code, languageId);
        const flashcards: Flashcard[] = [];

        // Generate flashcards based on detected concepts
        if (concepts.includes('Functions')) {
            flashcards.push({
                front: 'What is a function?',
                back: 'A reusable block of code that performs a specific task',
                category: 'Functions',
                difficulty: 'easy'
            });
        }

        if (concepts.includes('Loops')) {
            flashcards.push({
                front: 'What is the difference between for and while loops?',
                back: 'For loops are used when you know the number of iterations, while loops are used when you don\'t know the number of iterations',
                category: 'Loops',
                difficulty: 'medium'
            });
        }

        if (concepts.includes('Conditional Logic')) {
            flashcards.push({
                front: 'What are the three main conditional statements?',
                back: 'if, else if, and else',
                category: 'Conditional Logic',
                difficulty: 'easy'
            });
        }

        if (concepts.includes('Object-Oriented Programming')) {
            flashcards.push({
                front: 'What are the four pillars of OOP?',
                back: 'Encapsulation, Inheritance, Polymorphism, and Abstraction',
                category: 'Object-Oriented Programming',
                difficulty: 'hard'
            });
        }

        return flashcards;
    }

    generateLearningSteps(code: string, languageId: string): LearningStep[] {
        const lines = code.split('\n').filter(line => line.trim().length > 0);
        const steps: LearningStep[] = [];

        lines.forEach((line, index) => {
            const step = this.createLearningStep(line.trim(), languageId, index + 1);
            if (step) {
                steps.push(step);
            }
        });

        this.learningSteps = steps;
        return steps;
    }

    getCurrentStep(): LearningStep | null {
        if (this.currentStep < this.learningSteps.length) {
            return this.learningSteps[this.currentStep];
        }
        return null;
    }

    nextStep(): LearningStep | null {
        if (this.currentStep < this.learningSteps.length - 1) {
            this.currentStep++;
            return this.getCurrentStep();
        }
        return null;
    }

    previousStep(): LearningStep | null {
        if (this.currentStep > 0) {
            this.currentStep--;
            return this.getCurrentStep();
        }
        return null;
    }

    generateProjectIdeas(technologies: string[]): ProjectIdea[] {
        const ideas: ProjectIdea[] = [
            {
                title: 'Todo List Application',
                description: 'Build a simple todo list with add, edit, delete, and mark as complete functionality.',
                difficulty: 'beginner',
                technologies: ['JavaScript', 'HTML', 'CSS'],
                learningOutcomes: [
                    'DOM manipulation',
                    'Event handling',
                    'Local storage',
                    'CRUD operations'
                ],
                resources: [
                    'MDN Web Docs - DOM',
                    'JavaScript.info - Events',
                    'Local Storage API documentation'
                ]
            },
            {
                title: 'Weather Dashboard',
                description: 'Create a weather dashboard that fetches data from a weather API and displays it beautifully.',
                difficulty: 'intermediate',
                technologies: ['JavaScript', 'React', 'API Integration'],
                learningOutcomes: [
                    'API integration',
                    'Async/await',
                    'Component-based architecture',
                    'State management'
                ],
                resources: [
                    'OpenWeatherMap API',
                    'React documentation',
                    'Fetch API documentation'
                ]
            },
            {
                title: 'E-commerce Platform',
                description: 'Build a full-stack e-commerce platform with user authentication, product management, and payment integration.',
                difficulty: 'advanced',
                technologies: ['Node.js', 'Express', 'MongoDB', 'React', 'Stripe'],
                learningOutcomes: [
                    'Full-stack development',
                    'Database design',
                    'Authentication & authorization',
                    'Payment processing',
                    'Deployment'
                ],
                resources: [
                    'Node.js documentation',
                    'Express.js guide',
                    'MongoDB Atlas',
                    'Stripe documentation'
                ]
            },
            {
                title: 'Real-time Chat Application',
                description: 'Create a real-time chat application using WebSockets with features like private messaging and file sharing.',
                difficulty: 'advanced',
                technologies: ['Node.js', 'Socket.io', 'React', 'MongoDB'],
                learningOutcomes: [
                    'WebSocket programming',
                    'Real-time communication',
                    'File upload handling',
                    'User management'
                ],
                resources: [
                    'Socket.io documentation',
                    'WebSocket API',
                    'File upload best practices'
                ]
            },
            {
                title: 'Machine Learning Model API',
                description: 'Build an API that serves machine learning models for tasks like image classification or text analysis.',
                difficulty: 'advanced',
                technologies: ['Python', 'Flask', 'TensorFlow', 'Docker'],
                learningOutcomes: [
                    'ML model deployment',
                    'API design',
                    'Containerization',
                    'Model serving'
                ],
                resources: [
                    'TensorFlow documentation',
                    'Flask API tutorial',
                    'Docker basics',
                    'ML model deployment guide'
                ]
            }
        ];

        // Filter ideas based on user's technology preferences
        if (technologies.length > 0) {
            return ideas.filter(idea => 
                idea.technologies.some(tech => 
                    technologies.some(userTech => 
                        userTech.toLowerCase().includes(tech.toLowerCase()) ||
                        tech.toLowerCase().includes(userTech.toLowerCase())
                    )
                )
            );
        }

        return ideas;
    }

    generateBoilerplate(projectType: string, projectName: string): any {
        const boilerplates: { [key: string]: any } = {
            'react-app': {
                structure: [
                    'src/',
                    'src/components/',
                    'src/pages/',
                    'src/utils/',
                    'src/styles/',
                    'public/',
                    'package.json',
                    'README.md',
                    '.gitignore'
                ],
                readme: `# ${projectName}

## Description
A React application built with modern JavaScript.

## Getting Started
1. Clone the repository
2. Run \`npm install\`
3. Run \`npm start\`

## Features
- Component-based architecture
- Modern React hooks
- Responsive design

## Technologies
- React
- JavaScript/TypeScript
- CSS/SCSS

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
MIT
`,
                packageJson: {
                    name: projectName.toLowerCase().replace(/\s+/g, '-'),
                    version: '1.0.0',
                    description: `A React application - ${projectName}`,
                    main: 'index.js',
                    scripts: {
                        start: 'react-scripts start',
                        build: 'react-scripts build',
                        test: 'react-scripts test',
                        eject: 'react-scripts eject'
                    },
                    dependencies: {
                        react: '^18.0.0',
                        'react-dom': '^18.0.0',
                        'react-scripts': '5.0.1'
                    }
                }
            },
            'node-api': {
                structure: [
                    'src/',
                    'src/routes/',
                    'src/controllers/',
                    'src/models/',
                    'src/middleware/',
                    'src/utils/',
                    'tests/',
                    'package.json',
                    'README.md',
                    '.env.example',
                    '.gitignore'
                ],
                readme: `# ${projectName}

## Description
A Node.js API built with Express.

## Getting Started
1. Clone the repository
2. Run \`npm install\`
3. Copy \`.env.example\` to \`.env\` and configure
4. Run \`npm start\`

## Features
- RESTful API design
- Express.js framework
- Environment configuration
- Error handling

## Technologies
- Node.js
- Express.js
- MongoDB/PostgreSQL

## API Endpoints
- GET /api/health - Health check
- GET /api/items - Get all items
- POST /api/items - Create new item
- PUT /api/items/:id - Update item
- DELETE /api/items/:id - Delete item

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
MIT
`,
                packageJson: {
                    name: projectName.toLowerCase().replace(/\s+/g, '-'),
                    version: '1.0.0',
                    description: `A Node.js API - ${projectName}`,
                    main: 'src/index.js',
                    scripts: {
                        start: 'node src/index.js',
                        dev: 'nodemon src/index.js',
                        test: 'jest'
                    },
                    dependencies: {
                        express: '^4.18.0',
                        cors: '^2.8.5',
                        dotenv: '^16.0.0',
                        helmet: '^6.0.0'
                    },
                    devDependencies: {
                        nodemon: '^2.0.15',
                        jest: '^27.0.0'
                    }
                }
            }
        };

        return boilerplates[projectType] || boilerplates['react-app'];
    }

    private createLearningStep(line: string, languageId: string, stepNumber: number): LearningStep | null {
        if (line.length === 0) return null;

        let title = '';
        let description = '';
        let explanation = '';

        if (line.includes('function') || line.includes('def')) {
            title = 'Function Definition';
            description = 'Creating a reusable block of code';
            explanation = 'This line defines a function, which is a reusable block of code that can be called multiple times. Functions help organize code and make it more maintainable.';
        } else if (line.includes('if')) {
            title = 'Conditional Statement';
            description = 'Making decisions in code';
            explanation = 'This line creates a conditional statement that checks if something is true or false. If the condition is true, the code inside the block will execute.';
        } else if (line.includes('for') || line.includes('while')) {
            title = 'Loop Structure';
            description = 'Repeating code multiple times';
            explanation = 'This line creates a loop that repeats code multiple times. Loops are essential for processing data and automating repetitive tasks.';
        } else if (line.includes('return')) {
            title = 'Return Statement';
            description = 'Sending data back from a function';
            explanation = 'This line sends a value back from the function. Return statements are how functions communicate their results to the calling code.';
        } else if (line.includes('=')) {
            title = 'Variable Assignment';
            description = 'Storing data in variables';
            explanation = 'This line assigns a value to a variable. Variables are containers that store data for later use in the program.';
        } else if (line.includes('console.log') || line.includes('print')) {
            title = 'Output Statement';
            description = 'Displaying information';
            explanation = 'This line displays information on the screen. Output statements are useful for debugging and showing results to users.';
        } else {
            title = 'Code Execution';
            description = 'Running program logic';
            explanation = 'This line contains code that performs a specific action in your program.';
        }

        return {
            stepNumber,
            title,
            description,
            codeSnippet: line,
            explanation,
            pauseAfter: stepNumber % 3 === 0 // Pause every 3 steps
        };
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
} 