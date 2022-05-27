import { Form, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import {
  confirmOrder,
  confirmOrderItemDelivery,
  getAllOrdersInAddress,
  getOderbyId,
  getPickUpById,
} from "~/models/pickupstation.server";
import { getPickUpId, pickupLogout } from "~/session.server";

interface LoaderData {
  pickuporders: Awaited<ReturnType<typeof getAllOrdersInAddress>>;
  pickup: Awaited<ReturnType<typeof getPickUpById>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const pickUpId = await getPickUpId(request);
  if (!pickUpId) return redirect("/pickuplogin");
  const pickup = await getPickUpById(pickUpId);
  return json<LoaderData>(
    {
      pickuporders: await getAllOrdersInAddress(pickup?.address?.id as string),
      pickup: await getPickUpById(pickUpId),
    },
    {
      status: 200,
    }
  );
};

interface ActionData {
  order: Awaited<ReturnType<typeof confirmOrder>>;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const confirm = formData.get("confirmOrder");
  const orderId = formData.get("orderId") as string;
  const logout = formData.get("logout");

  if (typeof confirm === "string" && confirm === "confirmOrder") {
    const order = await getOderbyId(orderId);
    order?.orderItems.forEach(async (item) => {
      await confirmOrderItemDelivery(item.id as string);
    });
    return json<ActionData>({
      order: await confirmOrder(orderId),
    });
  }
  if (typeof logout === "string" && logout === "logout") {
    return pickupLogout(request);
  }
  return json({}, { status: 200 });
};

export default function pickup() {
  const loaderData = useLoaderData() as LoaderData;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KSH",
  });
  return (
    <div className="container mx-auto space-y-3 p-3">
      <div className=" flex items-center justify-between p-3">
        <div>
          <h1 className="text-2xl font-bold">
            {loaderData.pickup?.name} Pickup Station
          </h1>
        </div>
        <div>
          <Form method="post">
            <button
              type="submit"
              name="logout"
              value={"logout"}
              className="rounded bg-red-400 py-2 px-4 font-bold text-red-50 hover:bg-red-600"
            >
              Logout
            </button>
          </Form>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Order Item
              </th>
              <th scope="col" className="px-6 py-3">
                Customer phone
              </th>

              <th scope="col" className="px-6 py-3">
                Confirm Order
              </th>
            </tr>
          </thead>
          <tbody>
            {loaderData.pickuporders.map((order, index) => {
              return (
                <tr
                  className="border-b bg-white transition duration-150 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  key={order?.id}
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    {order?.order?.user?.name}
                  </th>
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span>{order?.potato?.variety}</span>
                      <span>{order?.quantity}</span>
                      <span>{formatter.format(order?.price as number)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">+254{order?.order?.user?.phone}</td>
                  <td className="px-6 py-4 ">
                    <Form method="post">
                      <input
                        type="hidden"
                        name="orderId"
                        value={order.order.id}
                      />
                      <button
                        type="submit"
                        name="confirmOrder"
                        value="confirmOrder"
                        className="font-medium text-red-400  hover:text-red-600 active:text-red-300 dark:text-red-500"
                      >
                        Confirm
                      </button>
                    </Form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
