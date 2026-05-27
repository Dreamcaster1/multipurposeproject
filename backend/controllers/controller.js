const UserModel = require("../models/usermodel");
const crypto = require("crypto");
class Servercontroller {
  constructor() {
    this.usermodel = new UserModel();
  }
  async changeLinkStatus(req, res) {
    await this.usermodel.changeLinkStatus(req.body.tokenHesh);
    res.send("Link status updated");
  }
  async fetchlinkstatus(req, res) {
    const tokenHesh = req.body.tokenHesh;
    const isValid = await this.usermodel.checkLinkStatus(tokenHesh);
    res.send({ isValid });
  }
  async forgotpassword(req, res) {
    let email = req.body.email;
    let userExists = await this.usermodel.checkifexists(email);
    if (userExists) {
      return res.send("If an account with the provided email exists, a password reset link has been sent.");
    }
    else {
    let hesh = await this.usermodel.getusertokenhesh(email);
    await this.usermodel.changelinkstatusafteruse(hesh);
    const resetLink = `https://multipurposeproject.onrender.com/resetpassword?token=${hesh}`; // lead the user to a page where they enter the new password
    async function sendEmail(email, subject, text) {
     const body = {
    sender: {
      email: "maslovskyy.fb@gmail.com",
      name: "App auth",
    },
    to: [{ email }],
    subject,
    textContent: text,
    };
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.REACT_APP_API_KEY_EMAIL, 
      "accept": "application/json",
    },
    body: JSON.stringify(body),
    });
    const data = await response.text();
    console.log(response.status, data);

    if (!response.ok) {
      throw new Error(`Brevo error ${response.status}: ${data}`);
    }
    else{
    
    }
    return data;
    }
    sendEmail(email, "Password Reset Request", `You requested a password reset. Please use the following link to reset your password: ${resetLink}`)
    res.send("If an account with the provided email exists, a password reset link has been sent.");
  }
}
forgotpasswordverify(req, res) {
  const token = req.query.token;
  res.redirect(`https://multipurposeproject.onrender.com/resetpassword?token=${token}`);
}
async changepassword(req, res) {
  const token = req.body.token;
  await this.usermodel.updatepassword(token, crypto.createHash("sha256").update(req.body.newpassword).digest("hex"));
  res.send("Password changed successfully");
}
  async checkemail(req, res) {
    try {
      let email = req.body.emailforcheck;
      let result = await this.usermodel.checkifexists(email);
      res.json(result);
    } catch (error) {
      console.error("checkemail error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async registration(req, res) {
    if(await this.usermodel.checkifexists(req.body.nameforreg) == false) {
      res.send("Email already exists");
    }
    else {
    console.log("Email does not exist, proceeding with registration");
    function generateToken() {
      const token = crypto.randomBytes(32).toString("hex");
      const hesh = crypto.createHash("sha256").update(token).digest("hex");
      return { token, hesh };
    }
    let generatedToken = generateToken().hesh;
    const verifylink = `https://multipurposeproject.onrender.com/verifyemail?token=${generatedToken}`;
    let email = req.body.nameforreg
    let password = crypto.createHash("sha256").update(req.body.passwordforreg).digest("hex");
    let city = req.body.cityforreg
    console.log(password)
    try {
      await this.usermodel.registerdata(email, password, city, generatedToken);
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).send("Registration failed");
    }
  async function sendEmail(email, subject, text) {
  const body = {
    sender: {
      email: "maslovskyy.fb@gmail.com",
      name: "App auth",
    },
    to: [{ email }],
    subject,
    textContent: text,
  };
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.REACT_APP_API_KEY_EMAIL, 
      "accept": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.text();
  console.log(response.status, data);

  if (!response.ok) {
    throw new Error(`Brevo error ${response.status}: ${data}`);
  }
  else{
  
  }
  return data;
 
}
await sendEmail(
      email,
      "Registration successful",
      `You registered with ${email} and city ${city}, please verify your email using this link: ${verifylink}`
    );
    res.send("Registration successful")
  }
  }
verifyemail(req, res) {
  this.usermodel.updateverified(req.query.token);
  console.log("Received token:", req.query);
  res.redirect("https://multipurposeproject.onrender.com/verifiedemail");
}

  async login(req, res) {
    let email = req.body.nameforlog;
    let password = crypto.createHash("sha256").update(req.body.passwordforlog).digest("hex");
    if(await this.usermodel.login(email, password) == true && await this.usermodel.checkifverified(email) == true) {
      req.session.isLoggedIn = true;
      res.send(true);
    }
    else {
      req.session.isLoggedIn = false;
      res.send(false);
    }
    console.log(req.session.isLoggedIn)
  }

  async checksession(req, res) {
    if(req.session.isLoggedIn) {
      res.send(true)
    }
    else {
      res.send(false)
    }
  }
  weathersession(req, res) {
    let citysesssion = req.body.citysessionback;
    req.session.savedcity = citysesssion;
    res.json(req.session.savedcity);
  }

  accesstosession(req, res) {
    res.json({ sessionback: req.session.savedcity });
  }

  currencychoice(req, res) {
    let currency = req.body.currchosen;
    req.session.savedcurrency = currency;
    res.json("Saved to session");
  }

  currencysend(req, res) {
    res.json(req.session.savedcurrency);
  }

  getrefreshtime(req, res) {
    let refreshsession = req.body.refreshlast;
    req.session.lastrefresh = refreshsession;
    res.send("Saved the data");
  }

  removefavmovie(req, res) {
    const removed = req.body.clickedtounfav;
    if (!req.session.favmoviesaved) {
      req.session.favmoviesaved = [];
      return res.send("Removed");
    }

    req.session.favmoviesaved = req.session.favmoviesaved.filter(
      (item) => item[0] !== removed
    );

    res.send("Removed");
  }

  zerothevalues(req, res) {
    if (!req.session.favmoviesaved) {
      req.session.favmoviesaved = [];
    }

    res.send("Done");
  }

  addfavmovie(req, res) {
    let favmovie = req.body.allfavmoviedata;

    if (!req.session.favmoviesaved) {
      req.session.favmoviesaved = [];
    }

    const exists = req.session.favmoviesaved.some((u) => u[0] === favmovie[0]);

    if (!exists) {
      req.session.favmoviesaved.push(favmovie);
    }

    res.send("saved cookie");
  }

  receivefavmovie(req, res) {
    if (req.session.favmoviesaved) {
      res.send(req.session.favmoviesaved);
    } else {
      res.send([]);
    }
  }

  savefromfrontend(req, res) {
    const { coin, isFav } = req.body;

    if (!req.session.savecoins) {
      req.session.savecoins = [];
    }

    if (isFav) {
      const exists = req.session.savecoins.some((item) => item.id === coin.id);

      if (!exists) {
        req.session.savecoins.push(coin);
      }
    } else {
      req.session.savecoins = req.session.savecoins.filter(
        (item) => item.id !== coin.id
      );
    }

    res.json(req.session.savecoins);
  }

  sendtofrontend(req, res) {
    res.json(req.session.savecoins || []);
  }

  sessioninterests(req, res) {
    req.session.sessioninterests = req.body;
    res.send("saved");
  }

  sendinterests(req, res) {
    console.log(req.session.sessioninterests);
    res.send(req.session.sessioninterests);
  }
}

module.exports = new Servercontroller();