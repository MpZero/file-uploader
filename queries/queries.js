const prisma = require("../prisma");

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

async function createFolders(userId, folderName) {
  try {
    await prisma.folder.create({
      data: {
        userId: userId,
        name: folderName,
      },
    });
    return;
  } catch (error) {
    console.log(error);
  }
}

async function updateFolder(folderId, newName) {
  try {
    await prisma.folder.update({
      where: { id: folderId },
      data: {
        name: newName,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteFolder(id) {
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

module.exports = {
  readFolders,
  createFolders,
  updateFolder,
  deleteFolder,
  readFolder,
};
