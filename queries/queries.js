const { PrismaClient } = require("@prisma/client");
const { genPassword } = require("../utils/passwordUtils");
const prisma = new PrismaClient();

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
    console.log(user);
  } catch (error) {
    console.log(error);
  }
}

async function readFolders(id) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: id },
    });

    return folders;
  } catch (error) {
    console.log(error);
  }
}

async function createFolders(userId, folderName, next) {
  try {
    const folder = await prisma.folder.create({
      data: {
        userId: userId,
        name: folderName,
      },
    });
    // return folder;
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = { findUser, createUser, readFolders, createFolders };
