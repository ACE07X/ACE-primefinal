export declare enum PersonaType {
    BUTLER = "BUTLER",
    SUPERVISOR = "SUPERVISOR"
}
export interface PersonaSelection {
    persona: PersonaType;
    userId: string;
    username: string;
    isOwner: boolean;
    timestamp: Date;
    messageId: string;
    channelId: string;
}
export interface UserIdentity {
    id: string;
    username: string;
    discriminator: string;
    displayName: string;
    isBot: boolean;
}
//# sourceMappingURL=persona.types.d.ts.map