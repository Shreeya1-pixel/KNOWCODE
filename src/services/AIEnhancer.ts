import * as vscode from 'vscode';
import { LocalModelService } from './LocalModelService';

export interface CodeAnalysis {
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    concepts: string[];
    suggestions: string[];
    funFacts: string[];
}

export interface CodeOptimization {
    currentPerformance: string;
    suggestedImprovements: string[];
    performanceGain: string;
    tradeoffs: string[];
}

export interface CodeStory {
    title: string;
    story: string;
    moral: string;
    characters: string[];
}

export class AIEnhancer {
    private static instance: AIEnhancer;
    private localModelService: LocalModelService;

    private constructor() {
        this.localModelService = LocalModelService.getInstance();
    }

    public static getInstance(): AIEnhancer {
        if (!AIEnhancer.instance) {
            AIEnhancer.instance = new AIEnhancer();
        }
        return AIEnhancer.instance;
    }

    // 🚀 MIND-BLOWING FEATURES FOR MARK ZUCKERBERG

    public async generateCodeStory(code: string, context: string): Promise<string> {
        const prompt = `Turn this code into an engaging story with characters and a plot!

Code:
${code}

Context: ${context}

Create a story that includes:
- A catchy title
- Characters based on variables/functions
- A plot based on what the code does
- A moral or lesson learned
- Make it fun and memorable!

Format: Title, Story, Moral, Characters`;

        const response = await this.localModelService.generateExplanation(code, context, 'story');
        return response.success ? response.content : 'Failed to generate story';
    }

    public async generateCodeOptimization(code: string, context: string): Promise<string> {
        const prompt = `Analyze this code for performance optimization opportunities!

Code:
${code}

Context: ${context}

Provide optimization insights:
- Current performance characteristics
- Specific improvements with code examples
- Expected performance gains
- Trade-offs to consider
- Make it actionable and measurable!`;

        const response = await this.localModelService.generateExplanation(code, context, 'optimization');
        return response.success ? response.content : 'Failed to generate optimization';
    }

    public async generateCodeChallenge(code: string, context: string): Promise<string> {
        const prompt = `Create a fun coding challenge based on this code!

Code:
${code}

Context: ${context}

Design a challenge that:
- Builds upon the concepts in this code
- Has clear success criteria
- Includes hints and tips
- Makes learning fun and engaging
- Has multiple difficulty levels`;

        const response = await this.localModelService.generateExplanation(code, context, 'challenge');
        return response.success ? response.content : 'Failed to generate challenge';
    }

    public async generateCodeMeme(code: string, context: string): Promise<string> {
        const prompt = `Create a funny programming meme or joke about this code!

Code:
${code}

Context: ${context}

Make it:
- Hilarious and relatable
- Programming humor
- Based on the code's quirks
- Shareable and memorable
- Include emojis and formatting!`;

        const response = await this.localModelService.generateExplanation(code, context, 'meme');
        return response.success ? response.content : 'Failed to generate meme';
    }

    public async generateCodePrediction(code: string, context: string): Promise<string> {
        const prompt = `Predict the future evolution of this code!

Code:
${code}

Context: ${context}

Predict:
- How this code might evolve in 1 year
- What new features could be added
- How technology changes might affect it
- Potential use cases in the future
- Make it exciting and visionary!`;

        const response = await this.localModelService.generateExplanation(code, context, 'prediction');
        return response.success ? response.content : 'Failed to generate prediction';
    }

    public async generateCodeInterview(code: string, context: string): Promise<string> {
        const prompt = `Create a mock technical interview based on this code!

Code:
${code}

Context: ${context}

Design an interview that includes:
- Technical questions about the code
- Behavioral questions
- System design questions
- Coding challenges
- Make it realistic and challenging!`;

        const response = await this.localModelService.generateExplanation(code, context, 'interview');
        return response.success ? response.content : 'Failed to generate interview';
    }

    public async generateCodeTutorial(code: string, context: string): Promise<string> {
        const prompt = `Create a step-by-step tutorial for building this code from scratch!

Code:
${code}

Context: ${context}

Include:
- Prerequisites and setup
- Step-by-step instructions
- Code snippets for each step
- Explanations of concepts
- Common pitfalls and solutions
- Make it beginner-friendly!`;

        const response = await this.localModelService.generateExplanation(code, context, 'tutorial');
        return response.success ? response.content : 'Failed to generate tutorial';
    }

    public async generateCodeComparison(code: string, context: string): Promise<string> {
        const prompt = `Compare this code with different approaches and languages!

Code:
${code}

Context: ${context}

Compare:
- Different programming languages
- Alternative algorithms
- Performance differences
- Readability and maintainability
- When to use each approach
- Make it educational and insightful!`;

        const response = await this.localModelService.generateExplanation(code, context, 'comparison');
        return response.success ? response.content : 'Failed to generate comparison';
    }

    public async generateCodeQuiz(code: string, context: string): Promise<string> {
        const prompt = `Create an interactive quiz about this code!

Code:
${code}

Context: ${context}

Create:
- Multiple choice questions
- True/false questions
- Fill-in-the-blank questions
- Code completion challenges
- Explanations for each answer
- Make it engaging and educational!`;

        const response = await this.localModelService.generateExplanation(code, context, 'quiz');
        return response.success ? response.content : 'Failed to generate quiz';
    }

    public async generateCodePortfolio(code: string, context: string): Promise<string> {
        const prompt = `Create a portfolio showcase for this code!

Code:
${code}

Context: ${context}

Include:
- Project description
- Technical highlights
- Screenshots/demos
- Technologies used
- Challenges overcome
- Learning outcomes
- Make it impressive and professional!`;

        const response = await this.localModelService.generateExplanation(code, context, 'portfolio');
        return response.success ? response.content : 'Failed to generate portfolio';
    }
}
