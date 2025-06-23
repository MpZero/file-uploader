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
  getUpload,
  postUpload,
} = require("../controllers/appController");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/////////ROUTES////////////

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
router.get("/upload", ensureAuthenticated, getUpload);
router.post("/upload", ensureAuthenticated, upload.single("file"), postUpload);

router.get("/log-out", logOut);

module.exports = router;
