const LuaSeal = require("../dist/src.js");

const key_list = [
    { key_value: "abcd1234efgh", discord_id: "123456789", key_days: 30, note: "Test key" }
];

const seal = new LuaSeal(process.argv[2], process.argv[3]);

(async () => {
    const res = await seal.importMassKeys(key_list);
    console.log(res);
})();