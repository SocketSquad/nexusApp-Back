export declare class UserEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    status: {
        online: boolean;
        lastSeen: Date;
    };
    accountStatus: {
        isBlocked: boolean;
        blockedReason?: string;
    };
    constructor(partial: Partial<UserEntity>);
}
