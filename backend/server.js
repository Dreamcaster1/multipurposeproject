const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
// Configure CORS to allow your Vercel frontend(s).
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://multipurposeproject.vercel.app,https://multipurposeproject-yhxq-git-main-dreamcaster1s-projects.vercel.app,https://multipurposeproject-yhxq.vercel.app").split(",").map(s => s.trim()).filter(Boolean);

const corsOptionsDelegate = function (req, callback) {
  const origin = req.header("Origin");
  // Allow non-browser requests (curl, server-to-server) when no origin is present
  if (!origin) {
    return callback(null, { origin: true, credentials: true });
  }

  // Allow explicit allowed origins or any vercel.app subdomain
  const isAllowed = allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);

  if (isAllowed) {
    return callback(null, { origin: true, credentials: true, optionsSuccessStatus: 200 });
  }

  // Deny other origins (CORS middleware will not set Access-Control-Allow-Origin)
  return callback(null, { origin: false });
};

app.use(cors(corsOptionsDelegate));
app.options("*", cors(corsOptionsDelegate));
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});