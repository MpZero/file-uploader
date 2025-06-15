// const { genPassword, validPassword } = require("../utils/passwordUtils");
const { findUser } = require("../queries/queries");
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
  getProtected,
};
