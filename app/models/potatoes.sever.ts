import { PotatoHarvest } from "@prisma/client";
import { prisma } from "~/db.server";

export const getPotatoHarvest = async () => {
  return prisma.potatoHarvest.findMany({
    where: {
      quantity: {
        gt: 0,
      },
      farm: {
        verified: true,
      },
    },
    include: {
      farm: {
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
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
};

export const findPotatoHarvest = async (id: PotatoHarvest["id"]) => {
  return prisma.potatoHarvest.findUnique({
    where: { id },
  });
};

export const updatePotataoHarvest = async (
  id: PotatoHarvest["id"],
  quantity: PotatoHarvest["quantity"]
) => {
  return prisma.potatoHarvest.update({
    where: {
      id,
    },
    data: {
      quantity,
    },
  });
};
