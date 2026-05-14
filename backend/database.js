let mysql = require("mysql2")
let pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Max29052007.",
    database: "reactexpress"
})
module.exports = pool
