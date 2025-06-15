const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function findUser(id) {
  const findUser = await prisma.user.findMany({});
  console.log(findUser);
}

module.exports = { findUser };
