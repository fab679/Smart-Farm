import { Form, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
} from "@remix-run/server-runtime";
import moment from "moment";
import {
  getFarmOrderItem,
  updateFarmOrderItemStatus,
} from "~/models/farm.server";
interface LoaderData {
  order: Awaited<ReturnType<typeof getFarmOrderItem>>;
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const orderItemId = params.orderItemId as string; // orderId is the id of the order
  return json<LoaderData>(
    {
      order: await getFarmOrderItem(orderItemId),
    },
    {
      status: 200,
    }
  );
};

interface ActionData {
  updatedorder: Awaited<ReturnType<typeof updateFarmOrderItemStatus>>;
}

export const action: ActionFunction = async ({ request, params }) => {
  const orderItemId = params.orderItemId as string; // orderId is the id of the order
  return json<ActionData>(
    {
      updatedorder: await updateFarmOrderItemStatus(orderItemId),
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
    <div className="container mx-auto h-full w-full space-y-2 p-3 shadow-sm ">
      <div className="space-y-4 divide-y rounded-md border p-4">
        <div className="w-full items-center rounded-md border p-4 lg:flex lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <img
              src={loaderData.order?.potato?.imgUrl}
              alt={loaderData.order?.potato?.variety}
            />
          </div>
          <div className="w-full flex-col space-y-2">
            <div className="flex items-center justify-center">
              <h4 className="text-base font-medium text-gray-700">
                Order Details
              </h4>
            </div>
            <div className="flex w-full flex-col justify-center space-y-2 px-10">
              <label htmlFor="Order Number" className="space-y-2">
                <h4 className="text-base font-medium text-gray-700">
                  Order Number
                </h4>
                <p>{loaderData?.order?.id}</p>
              </label>
              <label htmlFor="Address">
                <h4 className="text-base font-medium text-gray-700">Address</h4>
                <p>
                  <span>{loaderData?.order?.order.user.address[0].name}</span>,
                  {""}
                  <span>
                    {loaderData?.order?.order.user.address[0].location.name}
                  </span>{" "}
                  ,
                  <span>
                    {
                      loaderData?.order?.order.user.address[0].location.region
                        .name
                    }
                  </span>
                </p>
              </label>
              <label htmlFor="phone">
                <h4 className="text-base font-medium text-gray-700">Phone</h4>
                <p>+254{loaderData?.order?.order.user.phone}</p>
              </label>
              <label htmlFor="Date Placed" className="space-y-2">
                <h4 className="text-base font-medium text-gray-700">
                  Date Placed
                </h4>
                <p>{moment(loaderData?.order?.order.createdAt).format("LL")}</p>
              </label>
              <label htmlFor="Quantity" className="space-y-2">
                <h4 className="text-base font-medium text-gray-700">
                  Quantity
                </h4>
                <p className="text-base font-medium text-gray-700">
                  {loaderData?.order?.quantity}
                </p>
              </label>
              <label htmlFor="Total amount" className="space-y-2">
                <h4 className="text-base font-medium text-gray-700">
                  Total amount
                </h4>
                <p className="text-base font-medium text-lime-600">
                  {formatter.format(loaderData?.order?.price as number)}
                </p>
              </label>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-end justify-end">
            {loaderData.order?.status === "placed" ? (
              <Form method="post">
                <button
                  type="submit"
                  className="rounded bg-lime-500 py-2 px-4 font-bold text-white hover:bg-lime-700"
                >
                  Confirm Order
                </button>
              </Form>
            ) : (
              <div>
                <h4 className="text-base font-medium text-gray-700">
                  Order Status
                </h4>
                <p
                  className={` px-6 py-1 text-base uppercase  
                      ${
                        loaderData.order?.status === "shipped" &&
                        "bg-yellow-600 text-yellow-50"
                      }
                      ${
                        loaderData.order?.status === "completed" &&
                        "bg-green-600 text-green-50"
                      }
                    ${
                      loaderData.order?.status === "cancelled" &&
                      "bg-red-600 text-red-50"
                    }
                      `}
                >
                  {loaderData?.order?.status}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
