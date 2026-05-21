const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "multipurposeproject-yhxq.vercel.app",
    credentials: true,
  })
);
app.use(
  session({
    secret: "16117811",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 100000000000000,
      secure: false,
      httpOnly: false,
      sameSite: "lax",
    },
  })
);
const routes = require("./routes/routes");
app.use("/", routes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});