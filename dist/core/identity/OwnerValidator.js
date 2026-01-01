"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerValidator = void 0;
const constants_1 = require("../../config/constants");
class OwnerValidator {
    ownerId;
    constructor() {
        this.ownerId = constants_1.SYSTEM_CONSTANTS.OWNER_ID;
    }
    isOwner(identity) {
        return identity.id === this.ownerId;
    }
    getOwnerId() {
        return this.ownerId;
    }
}
exports.OwnerValidator = OwnerValidator;
//# sourceMappingURL=OwnerValidator.js.map