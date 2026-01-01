import { AIService, AIResponse } from './AIService';
import { BuiltPrompt } from '../../core/prompts/PromptBuilder';
export declare class OpenAIWrapper implements AIService {
    private readonly client;
    private readonly model;
    constructor();
    generateResponse(prompt: BuiltPrompt): Promise<AIResponse>;
}
//# sourceMappingURL=OpenAIWrapper.d.ts.map