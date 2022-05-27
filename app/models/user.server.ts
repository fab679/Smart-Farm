import type { Password, User, Farm, Address } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User, Farm } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      address: {
        include: {
          location: {
            include: {
              region: true,
            },
          },
          pickup: true,
        },
      },
    },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}
export async function getUserByPhone(phone: User["phone"]) {
  return prisma.user.findUnique({ where: { phone } });
}

export async function createUser(
  email: User["email"],
  name: User["name"],
  phone: User["phone"],
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      phone,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function updateUserAddress(
  id: User["id"],
  address: Address["id"]
) {
  return prisma.user.update({
    where: { id },
    data: {
      address: {
        connect: {
          id: address,
        },
      },
    },
  });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
export async function verifyFarmLogin(
  email: Farm["email"],
  password: Password["hash"]
) {
  const farmWithPassword = await prisma.farm.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!farmWithPassword || !farmWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    farmWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...farmWithoutPassword } = farmWithPassword;

  return farmWithoutPassword;
}

export const getUserOrders = async (id: User["id"]) => {
  return prisma.order.findMany({
    where: {
      user: {
        id,
      },
    },
    include: {
      user: {
        include: {
          address: {
            include: {
              location: {
                include: {
                  region: true,
                },
              },
            },
          },
        },
      },
      orderItems: {
        include: {
          farm: true,
        },
      },
    },
  });
};

export const deleteUserOrders = async (id: User["id"]) => {
  return prisma.order.deleteMany({
    where: {
      user: {
        id,
      },
    },
  });
};
