const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

// Trust proxy for Render / production
if (process.env.TRUST_PROXY === "1" || process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}


const corsOptions = {
  origin: [
    "https://multipurposeproject.vercel.app",
    "https://multipurposeproject-yhxq.vercel.app",
    "https://multipurposeproject-yhxq-git-main-dreamcaster1s-projects.vercel.app"
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "16117811",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 100000000000000,
      secure: isProduction,
      httpOnly: false,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

// Invalid JSON handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Invalid JSON received:", {
      error: err && err.stack ? err.stack : err,
    });

    return res.status(400).json({ error: "Invalid JSON" });
  }

  next(err);
});

const routes = require("./routes/routes");
app.use("/", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});