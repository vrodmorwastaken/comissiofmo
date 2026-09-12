const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_STAFF_USER || "admin";
  const password = process.env.SEED_STAFF_PASS || "canvia-aquesta-contrasenya";

  const existing = await prisma.staff.findUnique({ where: { username } });
  if (existing) {
    console.log(`L'usuari de staff "${username}" ja existeix.`);
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  await prisma.staff.create({
    data: { username, passwordHash, nom: "Administrador" },
  });

  console.log(`Usuari de staff creat -> usuari: ${username} / contrasenya: ${password}`);
  console.log("IMPORTANT: canvia aquesta contrasenya des del panell un cop facis login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
