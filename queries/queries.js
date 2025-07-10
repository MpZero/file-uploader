const prisma = require("../prisma");

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
    next(error);
  }
}

module.exports = {
  readFolders,
  createFolders,
  updateFolder,
  deleteFolder,
  readFolder,
};
