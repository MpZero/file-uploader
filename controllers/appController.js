// const { genPassword, validPassword } = require("../utils/passwordUtils");
const { findUser, createUser } = require("../queries/queries");
function getIndex(req, res) {
  res.render("index");
}
function getLogIn(req, res) {
  res.render("logIn", {
    title: "Log-In",
  });
}

async function postLogIn(req, res) {
  findUser();
}

function getSignUp(req, res) {
  res.render("signUp", {
    title: "Sign-Up",
  });
}

async function postSignUp(req, res) {
  console.log(req.body);
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

module.exports = {
  getIndex,
  getLogIn,
  postLogIn,
  getSignUp,
  postSignUp,
  getProtected,
};
