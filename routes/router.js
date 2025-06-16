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
// router.post(
//   "/login/password",
//   passport.authenticate("local", {
//     successRedirect: "/protected",
//     failureRedirect: "/login",
//   })
// );

router.get("/sign-up", getSignUp);
router.post("/sign-up", postSignUp);

router.use(
  passport.authenticate("session", {
    session: false,
    failureRedirect: "/",
  })
);
router.get("/protected", getProtected);

module.exports = router;
