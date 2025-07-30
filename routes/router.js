const { Router } = require("express");
const router = Router();
const path = require("path");
const multer = require("multer");

const {
  getIndex,
  getLogIn,
  postLogIn,
  getSignUp,
  postSignUp,
  logOut,
  getFolders,
  postFolders,
  getDeleteFolder,
  getUpdateFolder,
  postUpdateFolder,
  getFolderDetails,
} = require("../controllers/appController");
const {
  getUpdateFile,
  postUpdateFile,
  getFileDelete,
  getUpload,
  postUpload,
  getFileDownload,
} = require("../controllers/fileController");

// const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
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

router.get("/folders/:id/upload", ensureAuthenticated, getUpload);
router.post(
  "/folders/:id/upload",
  ensureAuthenticated,
  upload.single("file"),
  postUpload
);

router.get("/folders", ensureAuthenticated, getFolders);
router.post("/folders", postFolders);

router.get("/folders/:id/", ensureAuthenticated, getFolderDetails);
router.get("/folders/:id/update", ensureAuthenticated, getUpdateFolder);
router.post("/folders/:id/update", ensureAuthenticated, postUpdateFolder);

router.get("/folders/:id/delete", ensureAuthenticated, getDeleteFolder);

router.get("/folders/:id/file/:id/update", ensureAuthenticated, getUpdateFile);
router.post(
  "/folders/:id/file/:id/update",
  ensureAuthenticated,
  postUpdateFile
);

router.get(
  "/folders/:folderId/file/:id/download",
  ensureAuthenticated,
  getFileDownload
);
router.get(
  "/folders/:folderId/file/:id/delete",
  ensureAuthenticated,
  getFileDelete
);

router.get("/log-out", logOut);

module.exports = router;
