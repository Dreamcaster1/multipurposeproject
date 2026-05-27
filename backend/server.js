const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
// When running behind Render/Cloudflare/etc, enable trust proxy so secure cookies work
if (process.env.TRUST_PROXY === '1' || process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
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
// Use a RegExp matcher for OPTIONS routes to avoid path-to-regexp parsing errors for '*'
app.options(/.*/, cors(corsOptionsDelegate));
const isProduction = process.env.NODE_ENV === 'production';
app.use(
  session({
    secret: process.env.SESSION_SECRET || "16117811",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 100000000000000,
      secure: isProduction, // require HTTPS in production
      httpOnly: false,
      sameSite: isProduction ? 'none' : 'lax',
    },
  })
);

// Convert invalid JSON body parse errors into JSON responses (avoid HTML 400 pages)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', { error: err && err.stack ? err.stack : err });
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next(err);
});
const routes = require("./routes/routes");
app.use("/", routes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});