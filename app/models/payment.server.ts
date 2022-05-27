import { Order, Payment } from "@prisma/client";
import { prisma } from "~/db.server";

const getTime = () => {
  const date = new Date();
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours() + 3).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const time = year + month + day + hours + minutes + seconds;
  return time;
};
export const authorizations = async () => {
  let headers = new Headers();
  headers.append(
    "Authorization",
    "Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ=="
  );
  return fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" +
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
    { headers }
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log(error));
};

export const mpesaExpress = async (phoneNumber: string, amount: number) => {
  const timestamp = getTime();
  const shortcode = 174379;
  const passKey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  const password = btoa(timestamp + passKey + String(shortcode));
};

export const placePayment = async (
  amount: Payment["amount"],
  accountReference: Payment["paymentReference"],
  orderId: Order["id"]
) => {
  return prisma.payment.create({
    data: {
      status: "paid",
      amount,
      paymentReference: accountReference,
      paymentMethod: "mpesa",
      order: {
        connect: {
          id: orderId,
        },
      },
    },
  });
};
