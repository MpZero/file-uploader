const {
  findUser,
  createUser,
  readFolders,
  createFolders,
  deleteFolder,
  readFolder,
  updateFolder,
  createFile,
  updateFile,
  readFile,
  deleteFile,
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

async function getUpload(req, res) {
  const id = parseInt(req.params.id);
  res.render("upload", {
    title: "Upload a File",
    folderId: id,
    errors: [{ msg: req.flash("error") }],
  });
}

async function postUpload(req, res) {
  const folderId = parseInt(req.params.id);
  try {
    const { filename, destination, size } = req.file;
    // console.log(filename, destination, size);

    await createFile(folderId, filename, destination, size);
    // console.log("upload succesfully", file);
    res.redirect(`/folders/${folderId}/`);
  } catch (err) {
    console.error("Error creating file", err);
    req.flash("error", "File already exists");
    res.redirect(`/folders/${folderId}/upload`);
  }
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

async function getDeleteFolder(req, res) {
  try {
    // console.log(req.params.id);
    const folderId = req.params.id;
    await deleteFolder(parseInt(folderId));
    res.redirect("/folders");
  } catch (err) {
    console.error("Error deleting folder", err);
    req.flash("error", "Folder already deleted or Folder doesn't exist");
    res.redirect("/folders");
  }
}

async function getFolderDetails(req, res) {
  try {
    const folder = await readFolder(parseInt(req.params.id));
    // console.log(`getFolderDetails`, folder);
    // console.log(folder.files);
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
  const folderId = req.params.id;
  const folder = await readFolder(parseInt(req.params.id));
  // console.log({ folderId, folder });
  try {
    res.render("folderUpdate", {
      title: folder.name,
      folder: folder,
      errors: [{ msg: req.flash("error") }],
    });
  } catch (err) {
    console.error("Error updating folder", err);
    req.flash("error", "Unable to update folder");
    res.redirect(`/folders/${folderId}`);
  }
}

async function postUpdateFolder(req, res) {
  const folderId = req.params.id;
  const newName = req.body.newName;
  // console.log(folderId, newName);

  try {
    await updateFolder(parseInt(req.params.id), newName);
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    console.error("Error updating folder", err);
    req.flash("error", "Folder name already exists");
    res.redirect(`/folders/${folderId}/update`);
  }
}

async function getUpdateFile(req, res) {
  const fileId = req.params.id;
  const file = await readFile(parseInt(fileId));
  // console.log(file);

  try {
    res.render("fileUpdate", {
      title: file.filename,
      file: file,
      errors: [{ msg: req.flash("error") }],
    });
  } catch (err) {
    console.error("Error updating file", err);
    req.flash("error", "Unable to update file");
    res.redirect(`/folders/${file.folderId}`);
  }
}

async function postUpdateFile(req, res) {
  const fileId = req.params.id;
  const newName = req.body.newName;
  const file = await readFile(parseInt(fileId));
  const folderId = file.folderId;

  try {
    await updateFile(parseInt(fileId), newName);
    res.redirect(`/folders/${folderId}/file/${fileId}/update`);
  } catch (err) {
    console.error("Error updating file", err);
    req.flash("error", "File name already exists");
    res.redirect(`/folders/${folderId}/file/${fileId}/update`);
  }
}

async function getFileDelete(req, res) {
  // console.log(req.user);
  // console.log(req.params);

  try {
    const folderId = req.params.folderId;
    const fileId = req.params.id;
    await deleteFile(parseInt(fileId));
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    console.error("Error deleting file", err);
    req.flash("error", "File already delete or File doesn't exist");
    res.redirect(`/folders/${folderId}`);
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
  getUpdateFolder,
  postUpdateFolder,
  getDeleteFolder,
  getFolderDetails,
  getUpdateFile,
  postUpdateFile,
  getFileDelete,
  logOut,
};
