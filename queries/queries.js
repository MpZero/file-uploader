const { PrismaClient } = require("@prisma/client");
const { genPassword } = require("../utils/passwordUtils");
const prisma = new PrismaClient();

async function findUser(id) {
  const findUser = await prisma.user.findMany({});
  console.log(findUser);
}

async function createUser(username, password) {
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: await genPassword(password),
      },
    });
    console.log(user);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { findUser, createUser };
