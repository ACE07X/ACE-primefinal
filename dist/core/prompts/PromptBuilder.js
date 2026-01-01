"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptBuilder = void 0;
const persona_types_1 = require("../../types/persona.types");
const PromptLoader_1 = require("./PromptLoader");
class PromptBuilder {
    promptLoader;
    logger;
    constructor(promptLoader, logger) {
        this.promptLoader = promptLoader;
        this.logger = logger;
    }
    validatePersonaSelection(personaSelection) {
        if (!personaSelection) {
            throw new Error('PromptBuilder requires PersonaSelection. ' +
                'PersonaSelection must be completed before prompt building. ' +
                'This indicates a pipeline ordering violation.');
        }
        const validPersonas = Object.values(persona_types_1.PersonaType);
        if (!validPersonas.includes(personaSelection.persona)) {
            throw new Error(`Unknown persona type: '${personaSelection.persona}'. ` +
                `Valid personas: ${validPersonas.join(', ')}`);
        }
    }
    loadSystemPrompt(persona) {
        const promptType = persona === persona_types_1.PersonaType.BUTLER
            ? PromptLoader_1.PromptType.BUTLER_SYSTEM
            : PromptLoader_1.PromptType.SUPERVISOR_SYSTEM;
        try {
            const prompt = this.promptLoader.load(promptType);
            if (!prompt || prompt.trim().length === 0) {
                throw new Error(`System prompt for ${persona} is empty`);
            }
            this.logger.debug(`Loaded system prompt for persona: ${persona}`, {
                promptType,
                length: prompt.length,
            });
            return prompt;
        }
        catch (error) {
            throw new Error(`Failed to load system prompt for persona '${persona}': ${error.message}`, { cause: error });
        }
    }
    loadDeveloperPrompt() {
        try {
            const prompt = this.promptLoader.load(PromptLoader_1.PromptType.DEVELOPER);
            if (!prompt || prompt.trim().length === 0) {
                throw new Error('Developer prompt is empty');
            }
            this.logger.debug('Loaded developer prompt', {
                length: prompt.length,
            });
            return prompt;
        }
        catch (error) {
            throw new Error(`Failed to load developer prompt: ${error.message}`, { cause: error });
        }
    }
    formatContextBlock(context) {
        const parts = [];
        if (context.conversationSummary) {
            parts.push(`Conversation Context:\n${context.conversationSummary}`);
        }
        if (context.projectContext) {
            parts.push(`Project Context:\n${context.projectContext}`);
        }
        if (context.userPreferences) {
            parts.push(`User Preferences:\n${context.userPreferences}`);
        }
        if (context.additionalContext) {
            const additionalParts = Object.entries(context.additionalContext)
                .map(([key, value]) => `${key}:\n${value}`)
                .join('\n\n');
            if (additionalParts) {
                parts.push(additionalParts);
            }
        }
        return parts.join('\n\n');
    }
    assembleSystemMessage(systemPrompt, developerPrompt, context) {
        const components = [
            systemPrompt,
            developerPrompt,
        ];
        if (context) {
            const contextBlock = this.formatContextBlock(context);
            if (contextBlock.trim().length > 0) {
                components.push(`\n--- Context ---\n${contextBlock}`);
            }
        }
        return components.join('\n\n');
    }
    build(input) {
        const startTime = Date.now();
        this.logger.debug('Building prompt', {
            messageId: input.personaSelection?.messageId,
            persona: input.personaSelection?.persona,
            hasContext: !!input.context,
        });
        try {
            this.validatePersonaSelection(input.personaSelection);
            if (!input.userMessage || input.userMessage.trim().length === 0) {
                throw new Error('User message is required and cannot be empty');
            }
            const systemPrompt = this.loadSystemPrompt(input.personaSelection.persona);
            const developerPrompt = this.loadDeveloperPrompt();
            const systemMessageContent = this.assembleSystemMessage(systemPrompt, developerPrompt, input.context);
            const messages = [
                {
                    role: 'system',
                    content: systemMessageContent,
                },
                {
                    role: 'user',
                    content: input.userMessage,
                },
            ];
            const metadata = {
                persona: input.personaSelection.persona,
                userId: input.personaSelection.userId,
                messageId: input.personaSelection.messageId,
                builtAt: new Date(),
                hasContext: !!input.context,
            };
            const executionTime = Date.now() - startTime;
            this.logger.info('Prompt built successfully', {
                persona: metadata.persona,
                messageId: metadata.messageId,
                messageCount: messages.length,
                systemMessageLength: systemMessageContent.length,
                userMessageLength: input.userMessage.length,
                executionTimeMs: executionTime,
            });
            return {
                messages,
                metadata,
            };
        }
        catch (error) {
            this.logger.error('Prompt building failed', {
                error: error.message,
                messageId: input.personaSelection?.messageId,
                persona: input.personaSelection?.persona,
            });
            throw error;
        }
    }
    validate(builtPrompt) {
        if (builtPrompt.messages.length < 2) {
            throw new Error(`Invalid prompt: Expected at least 2 messages (system + user), got ${builtPrompt.messages.length}`);
        }
        if (builtPrompt.messages[0]?.role !== 'system') {
            throw new Error(`Invalid prompt: First message must be 'system' role, got '${builtPrompt.messages[0]?.role}'`);
        }
        const lastMessage = builtPrompt.messages[builtPrompt.messages.length - 1];
        if (lastMessage?.role !== 'user') {
            throw new Error(`Invalid prompt: Last message must be 'user' role, got '${lastMessage?.role}'`);
        }
        for (const message of builtPrompt.messages) {
            if (!message.content || message.content.trim().length === 0) {
                throw new Error(`Invalid prompt: Message with role '${message.role}' has empty content`);
            }
        }
        this.logger.debug('Prompt validation passed', {
            messageCount: builtPrompt.messages.length,
            persona: builtPrompt.metadata.persona,
        });
    }
    buildAndValidate(input) {
        const builtPrompt = this.build(input);
        this.validate(builtPrompt);
        return builtPrompt;
    }
}
exports.PromptBuilder = PromptBuilder;
//# sourceMappingURL=PromptBuilder.js.map