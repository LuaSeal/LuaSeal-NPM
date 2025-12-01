declare class LuaSealError extends Error {
    additionalInfo?: any;
    constructor(message: string, additionalInfo?: {
        key: string;
        value: any;
    });
}
declare class LuaSeal {
    private api_key;
    private project_id;
    constructor(api_key: string, project_id: string);
    private serverRequest;
    generateKey(options?: {
        key_days?: number;
        note?: string;
    }): Promise<any>;
    whitelistDiscordUser(discord_id: string, options?: {
        key_days?: number;
        note?: string;
    }): Promise<any>;
    importMassKeys(key_list?: {
        key_value: string;
        discord_id?: string;
        key_days?: number;
        note?: string;
    }[]): Promise<any>;
    unwhitelistKey(user_key: string): Promise<any>;
    updateKey(user_key: string, options?: {
        key_days?: number;
        discord_id?: string;
        note?: string;
    }): Promise<any>;
    blacklistKey(user_key: string, options?: {
        reason?: string;
        expire_time?: number;
    }): Promise<any>;
    unblacklistKey(user_key: string): Promise<any>;
    resetKeyHwid(user_key: string, options?: {
        force?: boolean;
    }): Promise<any>;
    getKeyInfo(options?: {
        discord_id?: string;
        user_key?: string;
        hwid?: string;
    }): Promise<any>;
    getAllKeys(): Promise<any>;
}
