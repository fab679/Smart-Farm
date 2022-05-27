import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import moment from "moment";
import { getplacedFarmOrders } from "~/models/farm.server";
import { getFarmId } from "~/session.server";

interface LoaderData {
  orders: Awaited<ReturnType<typeof getplacedFarmOrders>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const farmId = (await getFarmId(request)) as string;
  return json<LoaderData>(
    {
      orders: await getplacedFarmOrders(farmId),
    },
    {
      status: 200,
    }
  );
};

export default function index() {
  const loaderData = useLoaderData() as LoaderData;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KSH",
  });
  return (
    <div className="h-full w-full space-y-1 divide-y rounded-md  bg-white pb-10 shadow-md">
      <div className="flex w-full justify-center p-3 lg:justify-start">
        <h2 className="text-xl font-medium text-gray-800 ">Orders</h2>
      </div>
      <div>
        {loaderData.orders.length > 0 ? (
          <div className="flex w-full flex-col space-y-3 p-2">
            {loaderData.orders.map((order) => (
              <div
                key={order?.id}
                className="flex w-full flex-row items-center justify-between rounded-md border p-4"
              >
                <label htmlFor="Order Number" className="space-y-3">
                  <h4 className="text-base font-medium text-gray-700">
                    Order Number
                  </h4>
                  <p>{order?.id}</p>
                </label>
                <label htmlFor="Date Placed" className="space-y-3">
                  <h4 className="text-base font-medium text-gray-700">
                    Date Placed
                  </h4>
                  <p>{moment(order?.order?.createdAt).format("LL")}</p>
                </label>
                <label htmlFor="Total amount" className="space-y-3">
                  <h4 className="text-base font-medium text-gray-700">
                    Total amount
                  </h4>
                  <p className="text-base font-medium text-lime-500">
                    {formatter.format(order?.price)}
                  </p>
                </label>
                <label htmlFor="Items" className="space-y-3">
                  <h4 className="text-base font-medium text-gray-700">Items</h4>
                  <p>{order?.quantity} Bags</p>
                </label>

                <Link
                  to={`/farm/orders/${order.id}`}
                  className="rounded-md border bg-white p-2 text-gray-700 shadow-sm hover:border-lime-500  hover:bg-lime-600 hover:text-lime-50"
                >
                  View Order
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col divide-y">
            <div className="flex items-center justify-between">
              <h2 className="p-3 text-lg font-semibold text-gray-700">
                No Orders
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
