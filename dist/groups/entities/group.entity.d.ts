declare class GroupMemberEntity {
    userId: string;
    role: string;
    joinedAt: Date;
    permissions: string[];
}
declare class GroupSettingsEntity {
    privacy: string;
    joinApproval: boolean;
    allowInvites: boolean;
    messageRetention: number;
}
export declare class GroupEntity {
    id: string;
    name: string;
    description: string;
    avatar: {
        url: string;
        thumbnailUrl: string;
    };
    owner: string;
    members: GroupMemberEntity[];
    settings: GroupSettingsEntity;
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        lastActivityAt: Date;
    };
    constructor(partial: Partial<GroupEntity>);
}
export {};
