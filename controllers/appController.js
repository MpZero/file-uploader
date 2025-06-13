function getIndex(req, res) {
  res.render("index");
}
function getLogIn(req, res) {
  res.render("logIn", {
    title: "Log-In",
  });
}
function getSignUp(req, res) {
  res.render("signUp", {
    title: "Sign-Up",
  });
}

module.exports = {
  getIndex,
  getLogIn,
  getSignUp,
};
