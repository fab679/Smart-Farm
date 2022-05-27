import type {
  Description,
  Farm,
  Password,
  PotatoHarvest,
  Region,
  Location,
  Address,
  OrderItem,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "~/db.server";

export type { PotatoHarvest } from "@prisma/client";

export const GetFarmById = async (id: Farm["id"]) => {
  return prisma.farm.findUnique({ where: { id } });
};
export const getFarmByEmail = async (email: Farm["email"]) => {
  return prisma.farm.findUnique({ where: { email } });
};

export const createFarm = async (
  email: Farm["email"],
  name: Farm["name"],
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.farm.create({
    data: {
      name,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
};

export const getFarmPotatoes = async (id: Farm["id"]) => {
  return prisma.potatoHarvest.findMany({ where: { farm: { id } } });
};

export const createFarmPotatoes = async (
  id: Farm["id"],
  variety: PotatoHarvest["variety"],
  quantity: PotatoHarvest["quantity"],
  unitWeight: PotatoHarvest["unitWeight"],
  price: PotatoHarvest["price"],
  discount: PotatoHarvest["discount"],
  type: PotatoHarvest["type"],
  imgUrl: PotatoHarvest["imgUrl"]
) => {
  return prisma.potatoHarvest.create({
    data: {
      variety,
      quantity,
      initialQuantity: quantity,
      unitWeight,
      price,
      discount,
      type,
      imgUrl,
      farm: {
        connect: {
          id,
        },
      },
    },
  });
};

export const getFarmPotatoById = async (id: PotatoHarvest["id"]) => {
  return prisma.potatoHarvest.findUnique({ where: { id } });
};

export const updateFarmPotatoes = async (
  quantity: PotatoHarvest["quantity"],
  price: PotatoHarvest["price"],
  discount: PotatoHarvest["discount"],
  id: PotatoHarvest["id"]
) => {
  return prisma.potatoHarvest.update({
    where: {
      id,
    },
    data: {
      quantity,
      price,
      discount,
    },
  });
};

export const deleteFarmPotatoes = async (id: PotatoHarvest["id"]) => {
  return prisma.potatoHarvest.delete({ where: { id } });
};

export const updateFarmDetails = async (
  id: Farm["id"],
  name: Farm["name"],
  email: Farm["email"]
) => {
  return prisma.farm.update({
    where: {
      id,
    },
    data: {
      name,

      email,
    },
  });
};

export const createFarmDescription = async (
  description: Description["description"]
) => {
  return prisma.description.create({
    data: {
      description,
    },
  });
};

export const updateFarmDescription = async (
  description: Description["description"],
  id: Farm["id"]
) => {
  return prisma.description.update({
    where: {
      farmId: id,
    },
    data: {
      description,
    },
  });
};

export const updateFarmPassword = async (
  hash: Password["hash"],
  id: Farm["id"]
) => {
  return prisma.password.update({
    where: {
      farmId: id,
    },
    data: {
      hash,
    },
  });
};

export const updateFarmAddress = async (
  id: Farm["id"],
  address: Address["id"]
) => {
  return prisma.address.update({
    where: {
      id: address,
    },
    data: {
      farms: {
        connect: {
          id,
        },
      },
    },
  });
};

export const getplacedFarmOrders = (id: Farm["id"]) => {
  return prisma.orderItem.findMany({
    where: {
      farm: {
        id,
      },
      status: "placed",
    },
    include: {
      order: {
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
        },
      },
    },
  });
};
export const getshippedFarmOrders = (id: Farm["id"]) => {
  return prisma.orderItem.findMany({
    where: {
      farm: {
        id,
      },
      status: "shipped",
    },
    include: {
      order: {
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
        },
      },
    },
  });
};
export const getcompletedFarmOrders = (id: Farm["id"]) => {
  return prisma.orderItem.findMany({
    where: {
      farm: {
        id,
      },
      status: "delivered",
    },
    include: {
      order: {
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
        },
      },
    },
  });
};

export const getFarmOrderItem = (orderItemId: OrderItem["id"]) => {
  return prisma.orderItem.findUnique({
    where: {
      id: orderItemId,
    },
    include: {
      potato: true,
      order: {
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
        },
      },
    },
  });
};

export const updateFarmOrderItemStatus = async (
  orderItemId: OrderItem["id"]
) => {
  return prisma.orderItem.update({
    where: {
      id: orderItemId,
    },
    data: {
      status: "shipped",
    },
  });
};

export const getFarmOrderItemsCount = async (farmId: Farm["id"]) => {
  return prisma.orderItem.count({
    where: {
      farm: {
        id: farmId,
      },
      status: "placed",
    },
  });
};

export const getFarmOrderItems = async (farmId: Farm["id"]) => {
  return prisma.orderItem.findMany({
    where: {
      farm: {
        id: farmId,
      },
      status: "delivered",
    },
  });
};

export const getFarmEarnings = async (farmId: Farm["id"]) => {
  return prisma.orderItem.groupBy({
    by: ["status"],
    where: {
      status: "delivered",
      farm: {
        id: farmId,
      },
    },
    _sum: {
      price: true,
    },
  });
};

export const getFarmOrdersByPotatoType = async (farmId: Farm["id"]) => {
  return prisma.orderItem.findMany({
    take: 10,
    include: {
      potato: true,
    },
  });
};

export const getFarmOrdersByVariety = async (farmId: Farm["id"]) => {
  return prisma.potatoHarvest.findMany({
    where: {
      farmId: farmId,
    },
    include: {
      orderItems: true,
    },
  });
};
