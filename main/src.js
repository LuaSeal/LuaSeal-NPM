"use strict";
class LuaSealError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class LuaSeal {
    api_key;
    project_id;
    constructor(api_key, project_id) {
        if (!api_key)
            throw new Error("API key is required (argument #1)");
        if (!project_id)
            throw new Error("Project ID is required (argument #2)");
        if (!api_key.startsWith("seal") || api_key.length !== 25)
            throw new Error("Invalid API key format");
        this.api_key = api_key;
        this.project_id = project_id;
    }
    async serverRequest(endpoint, data, method = "POST") {
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
        }
        catch (error) {
            const e = error;
            if (e?.name === "TimeoutError" || e?.code === "ABORT_ERR")
                throw new LuaSealError("Request timed out");
        }
    }
    async generateKey(options = {}) {
        const request = await this.serverRequest("users", { ...options });
        return request.user_key;
    }
    async whitelistDiscordUser(discord_id, options = {}) {
        if (!discord_id)
            throw new LuaSealError("Discord ID is required (argument #1)");
        const request = await this.serverRequest("users", { discord_id, ...options });
        return request;
    }
    async unwhitelistKey(user_key) {
        if (!user_key)
            throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`users`, { user_key }, "DELETE");
        return request;
    }
    async updateKey(user_key, options = {}) {
        if (!user_key)
            throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`users`, { user_key, ...options }, "PATCH");
        return request;
    }
    async blacklistKey(user_key, options = {}) {
        if (!user_key)
            throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`blacklist`, { user_key, ...options });
        return request;
    }
    async unblacklistKey(user_key) {
        if (!user_key)
            throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`unblacklist`, { user_key });
        return request;
    }
    async resetKeyHwid(user_key, options = {}) {
        if (!user_key)
            throw new LuaSealError("User key is required (argument #1)");
        const request = await this.serverRequest(`resethwid`, { user_key, ...options });
        return request;
    }
    async getKeyInfo(options = {}) {
        const params = new URLSearchParams();
        if (options.user_key)
            params.append("user_key", options.user_key);
        if (options.discord_id)
            params.append("discord_id", options.discord_id);
        if (options.hwid)
            params.append("hwid", options.hwid);
        const query = params.toString() ? `?${params.toString()}` : "";
        const request = await this.serverRequest(`users${query}`, {}, "GET");
        return request.users;
    }
    async getAllKeys() {
        const request = await this.serverRequest(`users`, {}, "GET");
        return request.users;
    }
}
module.exports = LuaSeal;
