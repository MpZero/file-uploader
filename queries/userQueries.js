const { genPassword } = require("../utils/passwordUtils");
const prisma = require("../prisma");

async function findUser(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return user;
}

async function createUser(username, password) {
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: await genPassword(password),
      },
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  findUser,
  createUser,
};
