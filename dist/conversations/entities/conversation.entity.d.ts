declare class ParticipantEntity {
    userId: string;
    role: string;
    joinedAt: Date;
    lastRead: Date;
}
declare class LastMessageEntity {
    _id: string;
    content: string;
    senderId: string;
    sentAt: Date;
    type: string;
}
export declare class ConversationEntity {
    id: string;
    type: string;
    participants: ParticipantEntity[];
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        lastMessageAt: Date;
    };
    lastMessage?: LastMessageEntity;
    constructor(partial: Partial<ConversationEntity>);
}
export {};
