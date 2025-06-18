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
} = require("../controllers/appController");

router.get("/", getIndex);

router.get("/log-in", getLogIn);
router.post("/log-in", postLogIn);

router.get("/sign-up", ensureAuthenticated, getSignUp);
router.post("/sign-up", ensureAuthenticated, postSignUp);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.json({ unathorized: "unauthorized" });
  // res.redirect("/log-in");
}

router.get("/protected", ensureAuthenticated, getProtected);

// router.get("/protected", getProtected);

module.exports = router;
