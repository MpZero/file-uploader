const { findUser, createUser } = require("../queries/queries");
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
  console.log(req.body);

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

async function postSignUp(req, res) {
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
  logOut,
};
