const prisma = require("../prisma");

async function createFileDB(folderId, filename, destination, size, next) {
  try {
    const file = await prisma.file.create({
      data: {
        folderId: folderId,
        filename: filename,
        size: size,
        destination: destination,
      },
    });
    // console.log(file);
    return file;
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function readAllFiles(folderId) {
  try {
    const files = await prisma.file.findMany({
      where: { folderId },
    });
    return files;
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function readFile(id) {
  try {
    const file = await prisma.file.findUnique({
      where: { id: id },
    });

    return file;
  } catch (error) {
    console.log(error);
  }
}

async function updateFile(id, newName, destination, next) {
  try {
    await prisma.file.update({
      where: { id: id },
      data: {
        filename: newName,
        destination: destination,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
async function deleteAllFilesFromDB(folderId) {
  await prisma.file.deleteMany({
    where: { folderId },
  });
}

async function deleteFileFromDB(id, next) {
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
  createFileDB,
  readFile,
  readAllFiles,
  updateFile,
  deleteFileFromDB,
  deleteAllFilesFromDB,
};
