const { Router } = require("express");
const passport = require("passport");
const router = Router();

const {
  getIndex,
  getLogIn,
  postLogIn,
  getSignUp,
  postSignUp,
  getProtected,
  logOut,
} = require("../controllers/appController");

router.get("/", getIndex);

router.get("/log-in", getLogIn);
router.post("/log-in", postLogIn);

router.get("/sign-up", getSignUp);
router.post("/sign-up", postSignUp);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.json({ unathorized: "unauthorized" });
  // res.redirect("/log-in");
}

router.get("/protected", ensureAuthenticated, getProtected);

router.get("/log-out", logOut);

module.exports = router;
