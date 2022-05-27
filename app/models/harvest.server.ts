import { PotatoHarvest } from "@prisma/client";
import { prisma } from "~/db.server";

export const updateHarvestQuantity = async (
  id: PotatoHarvest["id"],
  quantity: number
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
