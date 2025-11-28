class LuaSealError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

class LuaSeal {
    private api_key: string;
    private project_id: string;

    constructor(api_key: string, project_id: string) {
        if (!api_key) throw new Error("API key is required (argument #1)");
        if (!project_id) throw new Error("Project ID is required (argument #2)");
        if (!api_key.startsWith("seal") || api_key.length !== 25) throw new Error("Invalid API key format");

        this.api_key = api_key;
        this.project_id = project_id;
    }

    private async serverRequest(endpoint: string, data: any, method: "GET" | "POST" | "PATCH" | "DELETE" = "POST") {
        try {
            const response = await fetch(`https://luaseal.com/api/projects/${this.project_id}/${endpoint}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.api_key
                },
                body: method !== "GET" ? JSON.stringify({ project_id: this.project_id, ...data }) : undefined,
                signal: AbortSignal.timeout(7000)
            });

            const json = await response.json();

            if (!json.success)
                throw new LuaSealError(json.response);

            return json;
        } catch(error) {
            const e = error as any;
            if (e?.name === "TimeoutError" || e?.code === "ABORT_ERR")
                throw new LuaSealError("Request timed out");
        }
    }

    public async generateKey(options: { key_days?: number, note?: string } = {}) {
        const request = await this.serverRequest("users", { ...options });
        return request.user_key;
    }

    public async whitelistDiscordUser(discord_id: string, options: { key_days?: number, note?: string } = {}) {
        if (!discord_id) throw new LuaSealError("Discord ID is required (argument #1)");
        const request = await this.serverRequest("users", { discord_id, ...options });
        return request;
    }

    public async unwhitelistKey(user_key: string) {
        if (!user_key) throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`users`, { user_key }, "DELETE");
        return request;
    }

    public async updateKey(user_key: string, options: { key_days?: number, discord_id?: string, note?: string } = {}) {
        if (!user_key) throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`users`, { user_key, ...options }, "PATCH");
        return request;
    }

    public async blacklistKey(user_key: string, options: { reason?: string, expire_time?: number } = {}) {
        if (!user_key) throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`blacklist`, { user_key, ...options });
        return request;
    }

    public async unblacklistKey(user_key: string) {
        if (!user_key) throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`unblacklist`, { user_key });
        return request;
    }

    public async resetKeyHwid(user_key: string, options: { force?: boolean } = {}) {
        if (!user_key) throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`resethwid`, { user_key, ...options });
        return request;
    }

    public async getKeyInfo(options: { discord_id?: string, user_key?: string, hwid?: string } = {}) {
        const params = new URLSearchParams();
        if (options.user_key) params.append("user_key", options.user_key);
        if (options.discord_id) params.append("discord_id", options.discord_id);
        if (options.hwid) params.append("hwid", options.hwid);

        const query = params.toString() ? `?${params.toString()}` : "";

        const request = await this.serverRequest(`users${query}`, {}, "GET");
        return request.users;
    }

    public async getAllKeys() {
        const request = await this.serverRequest(`users`, {}, "GET");
        return request.users;
    }
}

module.exports = LuaSeal;