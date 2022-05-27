import { ActionFunction, json, redirect } from "@remix-run/server-runtime";
import { updateOrder } from "~/models/orders.server";
import { placePayment } from "~/models/payment.server";
export const action: ActionFunction = async ({ request }) => {
  return await request
    .json()
    .then(async (res: any) => {
      const paymentReference = res?.Body?.stkCallback?.CallbackMetadata?.Item[1]
        ?.Value as string;
      const amount = res?.Body?.stkCallback?.CallbackMetadata?.Item[0]
        ?.Value as string;
      const url = new URL(request.url);
      const orderId = url.searchParams.get("orderId") as string;
      await placePayment(Number(amount), paymentReference, orderId);
      await updateOrder(orderId, "placed");
      return redirect("account/orders", { status: 200 });
    })
    .catch((err: any) => {
      console.log(err);
      return json(err, { status: 500 });
    });
};

export default function stckcallback() {
  return (
    <div className="flex min-h-full w-full items-center justify-center text-gray-600">
      Awaiting Payment and redirecting ...............
    </div>
  );
}
