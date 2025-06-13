const { Router } = require("express");
const router = Router();

const {
  getIndex,
  getLogIn,
  getSignUp,
} = require("../controllers/appController");

router.get("/", getIndex);
router.get("/log-in", getLogIn);
router.get("/sign-up", getSignUp);

module.exports = router;
