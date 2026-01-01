"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIWrapper = void 0;
const tslib_1 = require("tslib");
const openai_1 = tslib_1.__importDefault(require("openai"));
class OpenAIWrapper {
    client;
    model;
    constructor() {
        const apiKey = process.env['OPENAI_API_KEY'];
        if (!apiKey || apiKey.trim().length === 0) {
            throw new Error('OPENAI_API_KEY environment variable is required but not set. ' +
                'Please set OPENAI_API_KEY in your .env file or environment.');
        }
        this.client = new openai_1.default({
            apiKey,
        });
        this.model = process.env['OPENAI_MODEL'] || 'gpt-4';
    }
    async generateResponse(prompt) {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: prompt.messages,
                temperature: 0.7,
            });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('OpenAI API returned empty response content');
            }
            const usage = response.usage;
            return {
                text: content,
                model: response.model,
                tokenUsage: usage
                    ? {
                        promptTokens: usage.prompt_tokens,
                        completionTokens: usage.completion_tokens,
                        totalTokens: usage.total_tokens,
                    }
                    : undefined,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`OpenAI API call failed: ${error.message}`, { cause: error });
            }
            throw new Error(`OpenAI API call failed: ${String(error)}`, { cause: error });
        }
    }
}
exports.OpenAIWrapper = OpenAIWrapper;
//# sourceMappingURL=OpenAIWrapper.js.map