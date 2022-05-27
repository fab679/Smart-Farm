import { prisma } from "~/db.server";
import type {
  Address,
  Admin,
  Farm,
  Location,
  Password,
  PickUpStation,
  Region,
} from "@prisma/client";
export type { Admin };
import bcrypt from "bcryptjs";

export const getAdminBYId = async (id: Admin["id"]) => {
  return await prisma.admin.findUnique({
    where: {
      id,
    },
  });
};

export const createAdmin = async (
  email: Admin["email"],
  password: Password["hash"]
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.admin.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
};

export async function verifyAdminLogin(
  email: Admin["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.admin.findUnique({
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

export const getFarmersRequesting = async () => {
  return await prisma.farm.findMany({
    where: {
      verified: false,
    },
    include: {
      farmowner: true,
    },
  });
};

export const getFarm = async (id: Farm["id"]) => {
  return await prisma.farm.findUnique({
    where: {
      id,
    },
    include: {
      farmowner: true,
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
  });
};

export const verifyFarm = async (id: Farm["id"]) => {
  return await prisma.farm.update({
    where: {
      id,
    },
    data: {
      verified: true,
    },
  });
};

export const getAllAddress = async () => {
  return await prisma.address.findMany({
    include: {
      location: {
        include: {
          region: true,
        },
      },
    },
  });
};

export const getAllRegion = async () => {
  return await prisma.region.findMany({
    include: {
      location: {
        include: {
          address: true,
        },
      },
    },
  });
};

export const addRegion = async (name: Region["name"]) => {
  return await prisma.region.create({
    data: {
      name,
    },
  });
};

export const addLocation = async (
  name: Location["name"],
  regionId: Region["id"]
) => {
  return await prisma.location.create({
    data: {
      name,
      region: {
        connect: {
          id: regionId,
        },
      },
    },
  });
};

export const addAddress = async (id: Location["id"], name: Address["name"]) => {
  return await prisma.address.create({
    data: {
      name,
      location: {
        connect: {
          id,
        },
      },
    },
  });
};

export const createPickUp = async (
  name: PickUpStation["name"],
  email: PickUpStation["email"],
  password: Password["hash"],
  addressId: Address["id"]
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.pickUpStation.create({
    data: {
      name,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      address: {
        connect: {
          id: addressId,
        },
      },
    },
  });
};

export const getAllPickUp = async () => {
  return await prisma.pickUpStation.findMany({
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
  });
};
export const deleteAllPickUp = async () => {
  return await prisma.pickUpStation.deleteMany({});
};
