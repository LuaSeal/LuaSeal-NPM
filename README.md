# LuaSeal

[![Version](https://img.shields.io/npm/v/luaseal)](https://www.npmjs.com/package/luaseal)
[![Node.js](https://img.shields.io/node/v/luaseal)](https://nodejs.org/)
[![License](https://img.shields.io/npm/l/luaseal)](LICENSE)

This Api Wrapper is used for LuaSeal, it provides a secure and minimal interface for managing API keys in projects. Easily generate, update, whitelist, blacklist, and manage API keys with full TypeScript support and zero dependencies.

---

## Installation

**Install LuaSeal via npm:**

```npm install luaseal```

---

## Usage
```js
import LuaSeal from "luaseal";
//const LuaSeal = require("luaseal");

const seal = new LuaSeal("seal_yourApiKeyHere", "yourProjectId");

function getFutureUnix(days) {
    return Math.floor(Date.now() / 1000) + days * 86400;
}

(async () => {
    const key = await seal.generateKey({ key_days: 31 });
    console.log("Generated Key:", key);

    // await seal.generateKey({ key_days: getFutureUnix(31) }); // will be a specific unix timestamp instead of just amount of days
    // await seal.whitelistDiscordUser("314159265358979", { key_days: 10, note: "Auto linked to discord ID" }); // instead of just generating a unclaimed key, it will automatically link the generated key to the given ID

    await seal.updateKey(key, { discord_id: "314159265358979" });
    console.log("Key updated");

    await seal.blacklistKey(key);
    console.log("Key blacklisted");

    // await seal.blacklistKey(key, { expire_time: 31, reason: "Broke TOS" }); // this will blacklist the key for 31 days instead of a lifetime blacklist
    
    await seal.unblacklistKey(key);
    console.log("Key unblacklisted");

    try {
        await seal.resetKeyHwid(key, { force: true }); // There is a automatic system where users can only reset their hwid once a week, if they try reset it before 7 days this function will error responding "You must wait x day(s) before resetting HWID again" so to avoid this and bypass that cooldown you can use force. 
        console.log("HWID reset");
    } catch (error) {
        if (error.unix) { // error.unix will be avaiable if the user is on reset cooldown and "force" wasn't set true
            console.log(`You are current on cooldown from resetting your hwid, this cooldown will expire <t:${error.unix}:R>.`);
        } else {
            console.log("Error resetting HWID:", error.message);
        }
    }

    const info = await seal.getKeyInfo({ user_key: key }); 
    console.log(info);
    console.log(info[0].user_key);
    console.log(info[0].banned);

    const allKeys = await seal.getAllKeys();
    const randomEntry = allKeys[Math.floor(Math.random() * allKeys.length)];
    console.log(allKeys[randomEntry].user_key);
    console.log(allKeys[randomEntry].discord_id)

    // Note: getKeyInfo and getAllKeys always return arrays. 
    // Make sure to access the correct entry by index or other methods.

    await seal.unwhitelistKey(key);
})();
```

---

## API

### new LuaSeal(api_key: string, project_id: string)

Creates a new LuaSeal instance.

- api_key — Must be a valid API key.
- project_id — Must be a valid Project ID.

Throws on invalid arguments.

---

### Key Management

Method | Parameters | Description
------ | ---------- | -----------
generateKey | options? { key_days?: number, note?: string } | Generates a new API key. All fields in `options` are optional.
updateKey | user_key: string, options? { key_days?: number, discord_id?: string, note?: string } | Updates metadata for a key. `user_key` is required; all fields in `options` are optional.
blacklistKey | user_key: string, options? { reason?: string, expire_time?: number } | Blacklists a key. `user_key` is required; `reason` and `expire_time` are optional.
unblacklistKey | user_key: string | Removes a key from the blacklist. `user_key` is required.
resetKeyHwid | user_key: string, options? { force?: boolean } | Resets the HWID of a key. `user_key` is required; `force` is optional.

---

### User Management

Method | Parameters | Description
------ | ---------- | -----------
whitelistDiscordUser | discord_id: string, options? { key_days?: number, note?: string } | Whitelists a Discord user. `discord_id` is required; `options` are optional.
unwhitelistKey | user_key: string | Removes a key from whitelist. `user_key` is required.
getKeyInfo | options? { user_key?: string, discord_id?: string, hwid?: string } | Retrieves information about a key or user. All fields in `options` are optional.
getAllKeys | - | Retrieves all keys for the project. No parameters required.

---

## Error Handling

All errors are instances of LuaSealError. Network errors, timeouts, and backend responses provide descriptive messages.
```js
try {
    await seal.resetKeyHwid("invalidKey");
} catch (error) {
    console.log(error.message); // e.g. "No HWID is set for this key"
}
```

---

## Requirements

- Node.js 18+
- TypeScript (optional)
- Valid LuaSeal API key

---

## License

MIT © LuaSeal

---

## Useful Links

- [LuaSeal NPM Page](https://www.npmjs.com/package/luaseal)
- [LuaSeal Website](https://luaseal.com)
- [LuaSeal Documentation](https://docs.luaseal.com)
