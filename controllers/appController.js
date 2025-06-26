const {
  findUser,
  createUser,
  readFolders,
  createFolders,
} = require("../queries/queries");
const { validPassword } = require("../utils/passwordUtils");
function getIndex(req, res) {
  res.render("index");
}
function getLogIn(req, res) {
  res.render("logIn", {
    title: "Log-in",
  });
}

async function postLogIn(req, res, next) {
  // console.log(req.body);

  try {
    const { username, password } = req.body;
    const user = await findUser(username);

    if (!user) {
      return res.render("logIn", {
        title: "Log-in",
        errors: [{ msg: "User does not exist" }],
      });
    }

    const isValid = await validPassword(password, user.password);
    if (!isValid) {
      return res.render("logIn", {
        title: "Log-in",
        errors: [{ msg: "Invalid password" }],
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/protected");
    });
  } catch (err) {
    return next(err);
  }
}

function getSignUp(req, res) {
  res.render("signUp", {
    title: "Sign-Up",
  });
}

async function postSignUp(req, res, next) {
  // console.log(req.body);
  const { username, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.render("signUp", {
        title: "Sign-Up",
        errors: [{ msg: "Passwords do not match" }],
      });
    }

    await createUser(username, password);
    return res.redirect("/log-in");
  } catch (err) {
    console.error("Error creating user", err);
    next(err);
  }

  return res.redirect("/");
}

function getProtected(req, res) {
  res.render("protected", {
    title: "Protected Page",
  });
}
function getUpload(req, res) {
  res.render("upload", {
    title: "Upload a File",
  });
}

function postUpload(req, res) {
  console.log("upload succesfully");
  res.json(req.file);
}

async function getFolders(req, res, next) {
  try {
    const username = req.user.username;
    const id = req.user.id;
    const folders = await readFolders(id);
    // console.log(`folders`, folders);

    if (folders.length === 0) {
      res.render("folders", {
        title: `${username}'s Folders`,
        folders: folders,
        errors: [{ msg: "No folders found!" }],
      });
      return;
    }

    res.render("folders", {
      title: `${username}'s Folders`,
      folders: folders,
      errors: [{ msg: req.flash("error") }],
    });
  } catch (err) {
    console.error("Error getting folders", err);

    return next(err);
  }
}

async function postFolders(req, res) {
  try {
    const userId = req.user.id;
    const folderName = req.body.folderName;
    // console.log(userId, folderName);

    const folders = await createFolders(userId, folderName);
    // console.log(`folders`, folders);
    res.redirect("/folders");
  } catch (err) {
    console.error("Error creating folder", err);
    req.flash("error", "Folder already exists");
    res.redirect("/folders");
  }
}

function logOut(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}
module.exports = {
  getIndex,
  getLogIn,
  postLogIn,
  getSignUp,
  postSignUp,
  getUpload,
  postUpload,
  getProtected,
  getFolders,
  postFolders,
  logOut,
};
