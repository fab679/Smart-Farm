import { prisma } from "~/db.server";

import { FarmOwner } from "@prisma/client";

export const getOwnerByPhone = async (phone: FarmOwner["phone"]) => {
  return prisma.farmOwner.findUnique({ where: { phone } });
};

export const createOwner = async (
  firstname: FarmOwner["firstname"],
  lastname: FarmOwner["lastname"],
  phone: FarmOwner["phone"],
  idNumber: FarmOwner["idNumber"],
  idFront: FarmOwner["frontIdImageUrl"],

  farm: FarmOwner["farmId"]
) => {
  return prisma.farmOwner.create({
    data: {
      firstname,
      lastname,
      phone,
      idNumber,
      frontIdImageUrl: idFront,
      
      farm: {
        connect: {
          id: farm,
        },
      },
    },
  });
};
