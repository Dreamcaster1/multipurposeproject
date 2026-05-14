const pool = require("../database")
class UserModel {
    constructor() {
        this.pool = pool.promise()
    }
    async checkemail(email) {
        let [rows] = await this.pool.query("SELECT * FROM users WHERE email = ?", [email])
        return rows
    }
    async registerdata(email, password, city, hesh) {
        let res = await this.checkemail(email)

       if(res.length == 0) {
            console.log("Email does not exist, proceeding with registration")
           const result = await this.pool.query("INSERT INTO users (email, password, isVerified, verifyTokenHesh) VALUES (?, ?, ?, ?)", [email, password, false, hesh])
            return result
        }
        else {
            return "Email already exists"
        }
    }
    async checkifexists(email) {
        let [rows] = await this.pool.query("SELECT email FROM users WHERE email = ?", [email])
        if(rows.length == 0) {
            return true
        }
        else {
            return false
        }
    }
    async updateverified(hesh) {
        await this.pool.query("UPDATE users SET isVerified = true WHERE verifyTokenHesh = ?", [hesh])
    }
    async login(email, password) {
        let [rows] = await this.pool.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password])
        if(rows.length == 0) {
            return false
        }
        else {
            return true
        }
    }
   async checkifverified(email) {
    const [rows] = await this.pool.query(
        "SELECT isVerified FROM users WHERE email = ?",
        [email]
    );

    if (rows.length === 0) {
        console.log("No user found");
        return false;
    }

    const isVerified = rows[0].isVerified;

    console.log("isVerified:", isVerified);

    return isVerified === 1;
}
async getusertokenhesh(email) {
    const [rows] = await this.pool.query(
        "SELECT verifyTokenHesh FROM users WHERE email = ?",
        [email]
    );
    if (rows.length === 0) {
        console.log("No user found");
        return null;
    }
    const tokenHesh = rows[0].verifyTokenHesh;
    console.log("Token Hesh:", tokenHesh);
    return tokenHesh;
}
async changeLinkStatus(tokenHesh) {
    await this.pool.query("UPDATE users SET passwordChanged = ? WHERE verifyTokenHesh = ?", [1, tokenHesh])
}
async checkLinkStatus(tokenHesh) {
    const [rows] = await this.pool.query(
        "SELECT passwordChanged FROM users WHERE verifyTokenHesh = ?",
        [tokenHesh]
    );
    return rows.length > 0 ? rows[0].passwordChanged : false;
}
async changelinkstatusafteruse(tokenHesh) {
    await this.pool.query("UPDATE users SET passwordChanged = ? WHERE verifyTokenHesh = ?", [0, tokenHesh])
}
async updatepassword(tokenHesh, newPassword) {
    await this.pool.query("UPDATE users SET password = ? WHERE verifyTokenHesh = ?", [newPassword, tokenHesh])
}
}
module.exports = UserModel