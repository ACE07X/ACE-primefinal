import { PersonaSelection, PersonaType } from '../../types/persona.types';
import { PromptLoader } from './PromptLoader';
import { Logger } from '../../utils/logger';
export interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface ContextSummary {
    conversationSummary?: string;
    projectContext?: string;
    userPreferences?: string;
    additionalContext?: Record<string, string>;
}
export interface PromptBuildInput {
    personaSelection: PersonaSelection;
    userMessage: string;
    context?: ContextSummary;
}
export interface BuiltPrompt {
    messages: LLMMessage[];
    metadata: {
        persona: PersonaType;
        userId: string;
        messageId: string;
        builtAt: Date;
        hasContext: boolean;
    };
}
export declare class PromptBuilder {
    private readonly promptLoader;
    private readonly logger;
    constructor(promptLoader: PromptLoader, logger: Logger);
    private validatePersonaSelection;
    private loadSystemPrompt;
    private loadDeveloperPrompt;
    private formatContextBlock;
    private assembleSystemMessage;
    build(input: PromptBuildInput): BuiltPrompt;
    validate(builtPrompt: BuiltPrompt): void;
    buildAndValidate(input: PromptBuildInput): BuiltPrompt;
}
//# sourceMappingURL=PromptBuilder.d.ts.map