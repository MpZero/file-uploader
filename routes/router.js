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
  getFolders,
  postFolders,
  getDeleteFolder,
  getUpdateFolder,
  postUpdateFolder,
  getFileDelete,
  getFolderDetails,
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
router.post("/upload", upload.single("file"), postUpload);

router.get("/folders", ensureAuthenticated, getFolders);
router.post("/folders", postFolders);

router.get("/folders/:id/", ensureAuthenticated, getFolderDetails);
router.get("/folders/:id/update", ensureAuthenticated, getUpdateFolder);
router.post("/folders/:id/update", ensureAuthenticated, postUpdateFolder);

router.get("/folders/:id/delete", ensureAuthenticated, getDeleteFolder);

router.get(
  "/folders/:folderId/file/:id/delete",
  ensureAuthenticated,
  getFileDelete
);

router.get("/log-out", logOut);

module.exports = router;
