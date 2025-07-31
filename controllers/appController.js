const {
  readFolders,
  createFolders,
  deleteFolder,
  readFolder,
  updateFolder,
} = require("../queries/queries");
const { findUser, createUser } = require("../queries/userQueries");
const { validPassword } = require("../utils/passwordUtils");
const { removeFolderSupabase } = require("./supabaseController");

function getIndex(req, res) {
  res.render("index");
}

function getLogIn(req, res) {
  res.render("logIn", {
    title: "Log-in",
  });
}

async function postLogIn(req, res, next) {
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
      return res.redirect("/folders");
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

  return res.redirect("/sign-up");
}

async function getFolders(req, res, next) {
  try {
    const username = req.user.username;
    const id = req.user.id;

    const folders = await readFolders(id);

    if (folders.length === 0) {
      res.render("folders", {
        title: `${username}'s Folders`,
        username: username,
        folders: folders,
        errors: [{ msg: "No folders found!" }],
      });
      return;
    }

    res.render("folders", {
      title: `${username}'s Folders`,
      folders: folders,
      username: username,
      errors: [{ msg: req.flash("error") }],
    });
  } catch (err) {
    console.error("Error getting folders", err);
    return next(err);
  }
}

async function postFolders(req, res) {
  const userId = parseInt(req.user.id);
  const folderName = req.body.folderName;
  const userFolders = await readFolders(userId);
  let arr = [];
  userFolders.forEach((name) => {
    arr.push(name.name);
  });
  try {
    if (arr.includes(folderName)) {
      console.error("Folder already exists");
      req.flash("error", "Folder already exists");
      return res.redirect(`/folders`);
    }

    await createFolders(userId, folderName);
    res.redirect("/folders");
  } catch (err) {
    console.error("Error creating folder", err);
    req.flash("error", "Folder already exists");
    res.redirect("/folders");
  }
}

async function getDeleteFolder(req, res) {
  try {
    const folderId = parseInt(req.params.id);

    await removeFolderSupabase(folderId);

    await deleteFolder(folderId);

    res.redirect(`/folders`);
  } catch (err) {
    console.error("Error eliminando folder:", err);
    req.flash("error", "No se pudo eliminar la carpeta");
    res.redirect("/folders");
  }
}

async function getFolderDetails(req, res) {
  try {
    const folder = await readFolder(parseInt(req.params.id));
    res.render("folderDetails", {
      title: folder.name,
      folder: folder,
      files: folder.files,
    });
  } catch (err) {
    console.error("Error getting folder details", err);
    req.flash("error", "Unable to access folder details");
    res.redirect("/folders");
  }
}

async function getUpdateFolder(req, res) {
  const folderId = parseInt(req.params.id);
  const folder = await readFolder(folderId);
  try {
    res.render("folderUpdate", {
      title: folder.name,
      id: folder.id,
      errors: [{ msg: req.flash("error") }],
    });
  } catch (err) {
    console.error("Error updating folder", err);
    req.flash("error", "Unable to update folder");
    res.redirect(`/folders/${folderId}`);
  }
}

async function postUpdateFolder(req, res) {
  const folderId = parseInt(req.params.id);
  const newName = req.body.newName;
  const userFolders = await readFolders(req.user.id);
  let arr = [];
  userFolders.forEach((name) => {
    arr.push(name.name);
  });

  try {
    if (arr.includes(newName)) {
      console.error("Folder already exists");
      req.flash("error", "Folder already exists");
      return res.redirect(`/folders/${folderId}/update`);
    }
    await updateFolder(folderId, newName);
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    console.error("Error updating folder", err);
    req.flash("error", "Folder name already exists");
    res.redirect(`/folders/${folderId}/update`);
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
  getFolders,
  postFolders,
  getUpdateFolder,
  postUpdateFolder,
  getDeleteFolder,
  getFolderDetails,
  logOut,
};
