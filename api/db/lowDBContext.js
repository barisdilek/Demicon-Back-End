const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { json } = require("express/lib/response");
const adapter = new FileSync("api/db/users.json");

const db = low(adapter);

if (!db.has("Users").value()) {
    db.defaults({ Users: [] }).write();
}

module.exports = db;