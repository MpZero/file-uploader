const express = require("express");
require("dotenv").config();
const path = require("node:path");
const app = express();
const port = 8000;
const router = require("./routes/router");
// const passport = require("passport");
// const session = require("express-session");

// const session = require("express-session");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// require("./passport/passport")(passport);
// app.use(passport.initialize());

// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.authenticate("session"));

app.use("/", router);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Example app listening on port ${port}`);
});
