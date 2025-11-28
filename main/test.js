// > How to run properly
// run command "npm test {api_key} {project_id}"

const LuaSeal = require("luaseal");

const api_key = process.argv[2];
const project_id = process.argv[3];

if (!api_key)
    throw new Error("API key is required (argument #1)");

if (!project_id)
    throw new Error("Project ID is required (argument #2)");

const seal = new LuaSeal(api_key, project_id);

(async() => {
    const key = await seal.generateKey({ key_days: 31 });
    console.log(key);
    await seal.updateKey(key, { discord_id: "314423982709634560" });
    console.log(await seal.blacklistKey(key));
    console.log(await seal.resetKeyHwid(key, { force: true }));
    console.log(await seal.unblacklistKey(key));
    console.log(await seal.getKeyInfo({ user_key: key }));
})();