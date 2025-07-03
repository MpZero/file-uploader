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
    console.log(folders);

    return folders;
  } catch (error) {
    console.log(error);
  }
}

async function readFolder(id) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: id },
      include: { files: true },
    });

    return folder;
  } catch (error) {
    console.log(error);
  }
}

async function createFolders(userId, folderName, next) {
  try {
    await prisma.folder.create({
      data: {
        userId: userId,
        name: folderName,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function updateFolder(id, newName, next) {
  try {
    await prisma.folder.update({
      where: { id: id },
      data: {
        name: newName,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function deleteFolder(id, next) {
  try {
    await prisma.folder.delete({
      where: {
        id: id,
      },
      include: { files: true },
    });
    return;
  } catch (error) {
    console.log(error);
  }
}

async function deleteFile(id, next) {
  try {
    await prisma.file.delete({
      where: { id: id },
    });
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  findUser,
  createUser,
  readFolders,
  createFolders,
  deleteFile,
  deleteFolder,
  readFolder,
  updateFolder,
};
