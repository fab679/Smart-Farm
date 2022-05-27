import { prisma } from "~/db.server";

export const getAllLocation = async () => {
  return prisma.location.findMany({
    include: {
      address: true,
    },
  });
};
