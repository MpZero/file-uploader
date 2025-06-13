const express = require("express");
require("dotenv").config();
const path = require("node:path");
const app = express();
const port = 8000;
const router = require("./routes/router");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const assetsPath = path.join(__dirname, "public");

app.use(express.static(assetsPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Example app listening on port ${port}`);
});
