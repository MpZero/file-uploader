const express = require("express");
require("dotenv").config();
const path = require("node:path");
const app = express();
const port = 8000;
const router = require("./routes/router");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prisma");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./passport/passport")(passport);
app.use(flash());
app.use("/favicon.ico", express.static("public/images/favicon.ico"));
app.use("/", router);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Example app listening on port ${port}`);
});
