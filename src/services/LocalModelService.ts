import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ModelResponse {
    success: boolean;
    content: string;
    error?: string;
}

export class LocalModelService {
    private static instance: LocalModelService;
    private modelName = 'llama2:7b'; // Default model, will be auto-detected
    private isModelReady = false;
    private explanationCache = new Map<string, string>(); // Cache for speed optimization

    private constructor() {}

    public static getInstance(): LocalModelService {
        if (!LocalModelService.instance) {
            LocalModelService.instance = new LocalModelService();
        }
        return LocalModelService.instance;
    }

    public async initialize(): Promise<boolean> {
        try {
            // Check if Ollama is running
            const { stdout } = await execAsync('ollama list');
            
            // Auto-detect available models
            const availableModels = this.parseAvailableModels(stdout);
            if (availableModels.length > 0) {
                // Prefer code-optimized models
                const codeModel = availableModels.find(model => 
                    model.includes('code') || model.includes('codellama')
                );
                this.modelName = codeModel || availableModels[0];
                console.log(`Using model: ${this.modelName}`);
            } else {
                vscode.window.showWarningMessage('No models found. Please install a model first.');
                return false;
            }
            
            this.isModelReady = true;
            return true;
        } catch (error) {
            vscode.window.showWarningMessage('Ollama is not running. Please start Ollama first.');
            return false;
        }
    }

    private parseAvailableModels(ollamaListOutput: string): string[] {
        const lines = ollamaListOutput.split('\n');
        const models: string[] = [];
        
        for (const line of lines) {
            if (line.trim() && !line.includes('NAME') && !line.includes('---')) {
                const parts = line.split(/\s+/);
                if (parts[0]) {
                    models.push(parts[0]);
                }
            }
        }
        
        return models;
    }

    public async generateExplanation(
        code: string,
        context: string,
        mode: string = 'default'
    ): Promise<ModelResponse> {
        console.log('KNOWCODE: generateExplanation called with mode:', mode);
        
        if (!this.isModelReady) {
            console.log('KNOWCODE: Model not ready, initializing...');
            const initialized = await this.initialize();
            if (!initialized) {
                console.log('KNOWCODE: Failed to initialize model');
                return {
                    success: false,
                    content: '',
                    error: 'Local model not available'
                };
            }
        }

        // Speed optimization: Check cache first
        const cacheKey = `${code.substring(0, 100)}_${mode}`;
        if (this.explanationCache.has(cacheKey)) {
            console.log('KNOWCODE: Returning cached response for mode:', mode);
            return {
                success: true,
                content: this.explanationCache.get(cacheKey)!,
                error: undefined
            };
        }

        try {
            // Speed optimization: Limit context length (100-200 lines max)
            const limitedCode = this.limitContextLength(code);
            const prompt = this.buildPrompt(limitedCode, context, mode);
            console.log('KNOWCODE: Built prompt for mode:', mode);
            console.log('KNOWCODE: Using model:', this.modelName);
            
            const { stdout, stderr } = await execAsync(`ollama run ${this.modelName} "${prompt}"`);
            
            if (stderr) {
                console.log('KNOWCODE: Ollama stderr:', stderr);
            }
            
            const response = this.cleanResponse(stdout);
            console.log('KNOWCODE: Got response, length:', response.length);
            
            this.explanationCache.set(cacheKey, response);
            return { success: true, content: response, error: undefined };
        } catch (error) {
            console.log('KNOWCODE: Error in generateExplanation:', error);
            return {
                success: false,
                content: '',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private limitContextLength(code: string): string {
        const lines = code.split('\n');
        if (lines.length > 200) {
            // Take first 100 and last 100 lines for context
            const firstLines = lines.slice(0, 100);
            const lastLines = lines.slice(-100);
            return [...firstLines, '... (middle content omitted for speed) ...', ...lastLines].join('\n');
        }
        return code;
    }

    public async generateMCQs(code: string, context: string): Promise<ModelResponse> {
        const prompt = `Generate 3 multiple choice questions about this code:

Code:
${code}

Context: ${context}

Generate questions in this format:
1. Question: [question text]
   A) [option A]
   B) [option B]
   C) [option C]
   D) [option D]
   Answer: [correct option]

2. Question: [question text]
   A) [option A]
   B) [option B]
   C) [option C]
   D) [option D]
   Answer: [correct option]

3. Question: [question text]
   A) [option A]
   B) [option B]
   C) [option C]
   D) [option D]
   Answer: [correct option]`;

        return this.generateExplanation(code, context, 'mcq');
    }

    public async generateProjectIdea(code: string, context: string): Promise<ModelResponse> {
        const prompt = `Suggest a small, beginner-friendly coding project inspired by this code.
Keep it practical, fun, and achievable within a week for a student.

Here's the code:
${code}

Context: ${context}

Expected Output Format:
"You could make a number guessing game where the computer picks a secret number and you try to guess it."

Make it exciting and inspiring! Include:
- Project name and description
- Why it's fun to build
- What skills they'll learn
- Estimated time to complete`;

        return this.generateExplanation(code, context, 'project');
    }

    public async generateInterviewExplanation(code: string, context: string): Promise<ModelResponse> {
        const prompt = `Write a strong resume bullet point describing the achievement of writing this code. 
Make it action-oriented and professional. 
Avoid fluff.

Here's the code:
${code}

Context: ${context}

Expected Output Format:
"Developed a Python script that automates data entry, reducing manual workload by 80%."

Make it impressive and quantifiable! Focus on:
- What was accomplished
- Impact and results
- Technical skills demonstrated
- Business value created`;

        return this.generateExplanation(code, context, 'interview');
    }

    public async generateExplainLike5(code: string, context: string): Promise<ModelResponse> {
        console.log('KNOWCODE: generateExplainLike5 called with code:', code.substring(0, 100) + '...');
        console.log('KNOWCODE: Context:', context);
        
        // Ensure the model is ready
        if (!this.isModelReady) {
            console.log('KNOWCODE: Model not ready, initializing...');
            const initialized = await this.initialize();
            if (!initialized) {
                console.log('KNOWCODE: Failed to initialize model');
                return {
                    success: false,
                    content: '',
                    error: 'Local model not available. Please ensure Ollama is running and llama2:7b-chat is installed.'
                };
            }
        }

        try {
            // Use the explain5 mode specifically
            const response = await this.generateExplanation(code, context, 'explain5');
            console.log('KNOWCODE: Explain5 response received, success:', response.success);
            return response;
        } catch (error) {
            console.log('KNOWCODE: Error in generateExplainLike5:', error);
            return {
                success: false,
                content: '',
                error: error instanceof Error ? error.message : 'Unknown error in explain5 generation'
            };
        }
    }

    public async generateStepByStepBreakdown(code: string, context: string): Promise<ModelResponse> {
        const prompt = `Break down this code into logical chunks and explain each step:

Code:
${code}

Context: ${context}

Provide a step-by-step breakdown:
1. **Overview**: What does this code accomplish?
2. **Step-by-Step Analysis**: Break down each logical section
3. **Key Concepts**: What programming concepts are used?
4. **Flow**: How does the code flow from start to finish?

Use clear headings and numbered steps for easy understanding.`;

        return this.generateExplanation(code, context, 'step-by-step');
    }

    public async generateWhatsNext(code: string, context: string): Promise<ModelResponse> {
        const prompt = `Based on this code, suggest related concepts and what to learn next:

Code:
${code}

Context: ${context}

Suggest:
1. **Related Concepts**: What programming concepts are related to this code?
2. **Next Steps**: What should you learn next to build on this knowledge?
3. **Practice Ideas**: How can you practice and improve this code?
4. **Advanced Topics**: What advanced concepts build on this foundation?

Provide practical, actionable suggestions for continued learning.`;

        return this.generateExplanation(code, context, 'whats-next');
    }

    public async generateDebugInsight(code: string, context: string): Promise<ModelResponse> {
        const prompt = `Read this code and point out any possible bugs or errors.
Explain why they might cause issues and suggest a fix.

Here's the code:
${code}

Context: ${context}

Expected Output Format:
"The loop runs one time too many. Change <= to < to fix it."

Be specific and helpful! Look for:
- Logic errors
- Syntax issues
- Edge cases
- Performance problems
- Security vulnerabilities`;

        return this.generateExplanation(code, context, 'debug-insight');
    }

    public async generateStepByStepWalkthrough(code: string, context: string): Promise<ModelResponse> {
        const prompt = `Break this code down into a step-by-step explanation of what happens when it runs.
Number each step clearly.

Here's the code:
${code}

Context: ${context}

Expected Output Format:
"1. The program starts.
2. It creates a list of numbers.
3. It loops through each number and prints it."

Make it crystal clear and easy to follow!`;

        return this.generateExplanation(code, context, 'step-by-step');
    }

    public async generatePlainEnglishTranslation(code: string, context: string): Promise<ModelResponse> {
        const prompt = `Translate the logic of this code into plain, everyday English without code syntax.
Make it sound like instructions for a person, not a computer.

Here's the code:
${code}

Context: ${context}

Expected Output Format:
"First, write down the names of all your friends. Then, say hello to each one in turn."

Make it conversational and easy to understand!`;

        return this.generateExplanation(code, context, 'plain-english');
    }

    public async generateLearningSteps(code: string, context: string): Promise<ModelResponse> {
        const prompt = `Create step-by-step learning steps for this code:

Code:
${code}

Context: ${context}

Provide learning steps in this format:
**Step 1**: [First concept to understand]
**Step 2**: [Second concept to understand]
**Step 3**: [Third concept to understand]
[Continue for all major concepts]

Each step should build on the previous one and help understand the code progressively.`;

        return this.generateExplanation(code, context, 'learning');
    }

    private buildPrompt(code: string, context: string, mode: string): string {
        const basePrompt = `You are KNOWCODE, an AI assistant that helps developers understand code. 
You provide clear, helpful explanations in a friendly tone.

Code to explain:
${code}

Context: ${context}

Please provide a helpful explanation that is:`;

        switch (mode) {
            case 'mcq':
                return this.buildMCQPrompt(code, context);
            case 'project':
                return this.buildProjectPrompt(code, context);
            case 'interview':
                return this.buildInterviewPrompt(code, context);
            case 'explain5':
                return this.buildExplain5Prompt(code, context);
            case 'learning':
                return this.buildLearningPrompt(code, context);
            default:
                return `${basePrompt}
- Clear and concise
- Focused on understanding
- Includes key concepts
- Provides practical insights`;
        }
    }

    private buildMCQPrompt(code: string, context: string): string {
        return `Generate 3 multiple choice questions about this code:

Code:
${code}

Context: ${context}

Generate questions in this format:
1. Question: [question text]
   A) [option A]
   B) [option B]
   C) [option C]
   D) [option D]
   Answer: [correct option]

2. Question: [question text]
   A) [option A]
   B) [option B]
   C) [option C]
   D) [option D]
   Answer: [correct option]

3. Question: [question text]
   A) [option A]
   B) [option B]
   C) [option C]
   D) [option D]
   Answer: [correct option]`;
    }

    private buildProjectPrompt(code: string, context: string): string {
        return `Based on this code, suggest a project idea that builds upon or extends this functionality:

Code:
${code}

Context: ${context}

Provide a project idea in this format:
**Project Name**: [Name]
**Description**: [Brief description]
**Key Features**: [List of features]
**Technologies**: [Technologies needed]
**Difficulty**: [Beginner/Intermediate/Advanced]
**Learning Outcomes**: [What you'll learn]`;
    }

    private buildInterviewPrompt(code: string, context: string): string {
        return `Explain this code as if you're answering a technical interview question:

Code:
${code}

Context: ${context}

Provide an interview-style explanation covering:
1. **What the code does** (high-level overview)
2. **Key concepts used** (algorithms, data structures, patterns)
3. **Time/Space complexity** (if applicable)
4. **Potential improvements** (optimizations, edge cases)
5. **Alternative approaches** (different solutions)

Format as a clear, professional interview response.`;
    }

    private buildExplain5Prompt(code: string, context: string): string {
        return `Explain this code to me as if I'm a 5-year-old. 
Use simple words, analogies, and keep it short and fun. 
Avoid technical jargon unless absolutely necessary.

Here's the code:
${code}

Context: ${context}

Expected Output Format:
"This code is like a robot that counts numbers for you. It starts at 1, keeps adding 1 until it reaches 10, and tells you each number it counts."

Make it engaging with emojis and fun analogies that a 5-year-old would love! 🎈`;
    }

    private buildLearningPrompt(code: string, context: string): string {
        return `Create step-by-step learning steps for this code:

Code:
${code}

Context: ${context}

Provide learning steps in this format:
**Step 1**: [First concept to understand]
**Step 2**: [Second concept to understand]
**Step 3**: [Third concept to understand]
[Continue for all major concepts]

Each step should build on the previous one and help understand the code progressively.`;
    }

    private cleanResponse(response: string): string {
        // Remove Ollama-specific formatting and clean up the response
        return response
            .replace(/^```\w*\n/, '') // Remove opening code block
            .replace(/\n```$/, '') // Remove closing code block
            .trim();
    }

    public async testConnection(): Promise<boolean> {
        try {
            // Initialize to get the model name
            await this.initialize();
            const { stdout } = await execAsync(`ollama run ${this.modelName} "Hello"`);
            return stdout.length > 0;
        } catch {
            return false;
        }
    }

    public async getModelInfo(): Promise<{ name: string; size: string; status: string }> {
        try {
            await this.initialize();
            const { stdout } = await execAsync('ollama list');
            const lines = stdout.split('\n');
            const modelLine = lines.find(line => line.includes(this.modelName));
            
            if (modelLine) {
                const parts = modelLine.split(/\s+/);
                return {
                    name: parts[0] || this.modelName,
                    size: parts[1] || 'Unknown',
                    status: 'Ready'
                };
            }
            
            return {
                name: this.modelName,
                size: 'Unknown',
                status: 'Not found'
            };
        } catch {
            return {
                name: this.modelName,
                size: 'Unknown',
                status: 'Error'
            };
        }
    }

    /**
     * Check if the model is ready
     */
    public getModelReadyStatus(): boolean {
        return this.isModelReady;
    }
}
