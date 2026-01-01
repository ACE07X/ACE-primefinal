"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAvailabilityChecker = void 0;
class AIAvailabilityChecker {
    static isOpenAIAvailable() {
        const apiKey = process.env['OPENAI_API_KEY'];
        return !!(apiKey && apiKey.trim().length > 0);
    }
}
exports.AIAvailabilityChecker = AIAvailabilityChecker;
//# sourceMappingURL=AIAvailabilityChecker.js.map