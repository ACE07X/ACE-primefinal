"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptValidator = void 0;
class PromptValidator {
    static FORBIDDEN_PATTERNS = [
        /\$\{[^}]*\}/g,
        /\{\{[^}]*\}\}/g,
    ];
    static validate(promptText, promptName) {
        if (typeof promptText !== 'string') {
            throw new Error(`Prompt '${promptName}' validation failed: Expected string, got ${typeof promptText}`);
        }
        const trimmed = promptText.trim();
        if (trimmed.length === 0) {
            throw new Error(`Prompt '${promptName}' validation failed: Prompt text is empty or whitespace-only`);
        }
        for (const pattern of PromptValidator.FORBIDDEN_PATTERNS) {
            if (pattern.test(promptText)) {
                throw new Error(`Prompt '${promptName}' validation failed: Contains forbidden pattern ${pattern.source}. ` +
                    `Prompts should be static text without template placeholders.`);
            }
        }
    }
    static validateMinLength(promptText, promptName, minLength) {
        const trimmed = promptText.trim();
        if (trimmed.length < minLength) {
            throw new Error(`Prompt '${promptName}' validation failed: ` +
                `Length ${trimmed.length} is less than minimum ${minLength} characters`);
        }
    }
    static validateMaxLength(promptText, promptName, maxLength) {
        if (promptText.length > maxLength) {
            throw new Error(`Prompt '${promptName}' validation failed: ` +
                `Length ${promptText.length} exceeds maximum ${maxLength} characters`);
        }
    }
}
exports.PromptValidator = PromptValidator;
//# sourceMappingURL=PromptValidator.js.map