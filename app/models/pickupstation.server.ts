import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import type {
  Address,
  Order,
  OrderItem,
  Password,
  Payment,
  PickUpStation,
} from "@prisma/client";

export type { PickUpStation } from "@prisma/client";

export const getPickUpStationById = async (id: string) => {
  return prisma.pickUpStation.findUnique({
    where: {
      id,
    },
  });
};

export const updatepickupstationPassword = async (
  id: string,
  name: PickUpStation["name"],
  password: Password["hash"]
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.pickUpStation.update({
    where: {
      id,
    },
    data: {
      name: name,
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });
};

export const verifyPickUpStationLogin = async (
  email: PickUpStation["email"],
  password: Password["hash"]
) => {
  const userWithPassword = await prisma.pickUpStation.findUnique({
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

  return userWithPassword;
};

export const confirmOrderDelivery = async (
  id: Order["id"],
  status: string,
  paymentStatus: Payment["status"]
) => {
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
      payment: {
        update: { status: paymentStatus },
      },
    },
  });
};

export const getAllPickUpStations = async () => {
  return prisma.pickUpStation.findMany({
    include: {
      address: {
        include: {
          location: true,
        },
      },
    },
  });
};

export const getPickUpStationByAddress = async (address: Address["id"]) => {
  return prisma.address.findUnique({
    where: {
      id: address,
    },
    include: {
      pickup: true,
    },
  });
};

export const getPickUpById = async (id: PickUpStation["id"]) => {
  return prisma.pickUpStation.findUnique({
    where: {
      id,
    },
    include: {
      address: true,
    },
  });
};

export const getUserOrdersbyAddress = async (address: Address["id"]) => {
  return prisma.user.findMany({
    where: {
      address: {
        some: {
          id: address,
        },
      },
      orders: {
        some: {
          status: "shipped",
        },
      },
    },
    include: {
      orders: {
        include: {
          orderItems: true,
          payment: true,
        },
      },
    },
  });
};

export const getAllOrdersInAddress = async (address: Address["id"]) => {
  return prisma.orderItem.findMany({
    where: {
      order: {
        address: {
          id: address,
        },
      },
      status: "shipped",
    },
    include: {
      potato: true,
      order: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const confirmOrder = async (id: Order["id"]) => {
  console.log(id);
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      status: "deliverd",
    },
  });
};

export const getOderbyId = async (id: Order["id"]) => {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      orderItems: true,
    },
  });
};

export const confirmOrderItemDelivery = async (
  orderItemId: OrderItem["id"]
) => {
  return prisma.orderItem.update({
    where: {
      id: orderItemId,
    },
    data: {
      status: "delivered",
    },
  });
};
