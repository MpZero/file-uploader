const bcrypt = require("bcrypt");

async function validPassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (err) {
    console.error(err);
  }
}

async function genPassword(password) {
  const generatedPw = await bcrypt.hash(password, 10);
  return generatedPw;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
