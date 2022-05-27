import { prisma } from "~/db.server";

import type { Order } from "@prisma/client";

export const placeOrder = async (data: any) => {
  return prisma.order.create({
    data: {
      status: "pending",
      total: data?.total,
      user: {
        connect: {
          id: data?.userId,
        },
      },
      address: {
        connect: {
          id: data?.addressId,
        },
      },
    },
  });
};

export const addOrderItem = async (data: any, orderId: Order["id"]) => {
  return prisma.orderItem.create({
    data: {
      price: data?.total,
      quantity: data?.qty,
      potato: {
        connect: {
          id: data?.id,
        },
      },
      order: {
        connect: {
          id: orderId,
        },
      },
      farm: {
        connect: {
          id: data?.farmId,
        },
      },
    },
  });
};

export const updateOrder = async (id: string, status: Order["status"]) => {
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

export const getOrder = async (id: string) => {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      orderItems: {
        include: {
          potato: {
            include: {
              farm: true,
            },
          },
        },
      },
    },
  });
};
