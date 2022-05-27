import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function seed() {
  const adminemail = "admin@admin.com";
  const adminpassword = "adminraport";
  const hashedPassword = await bcrypt.hash(adminpassword, 10);

  await prisma.admin
    .delete({
      where: {
        email: adminemail,
      },
    })
    .catch(() => {
      //no worries if it doesn't exist yet
    });
  await prisma.admin.create({
    data: {
      email: adminemail,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
