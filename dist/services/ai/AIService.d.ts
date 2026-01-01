import { BuiltPrompt } from '../../core/prompts/PromptBuilder';
export interface AIResponse {
    text: string;
    model: string;
    tokenUsage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
export interface AIService {
    generateResponse(prompt: BuiltPrompt): Promise<AIResponse>;
}
//# sourceMappingURL=AIService.d.ts.map