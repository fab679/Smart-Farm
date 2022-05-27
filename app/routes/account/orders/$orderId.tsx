import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import moment from "moment";
import { getOrder } from "~/models/orders.server";

interface LoaderData {
  order: Awaited<ReturnType<typeof getOrder>>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const orderId = params.orderId as string; // orderId is the id of the order
  return json<LoaderData>(
    {
      order: await getOrder(orderId),
    },
    {
      status: 200,
    }
  );
};

export default function order() {
  const loaderData = useLoaderData() as LoaderData;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KSH",
  });
  return (
    <div className="container mx-auto h-full w-full space-y-2 p-3 shadow-sm ">
      <div className="space-y-4 divide-y rounded-md border p-4">
        <div className="flex w-full flex-row items-center justify-between rounded-md border p-4">
          <label htmlFor="Order Number" className="space-y-3">
            <h4 className="text-base font-medium text-gray-700">
              Order Number
            </h4>
            <p>{loaderData?.order?.id}</p>
          </label>
          <label htmlFor="Date Placed" className="space-y-3">
            <h4 className="text-base font-medium text-gray-700">Date Placed</h4>
            <p>{moment(loaderData?.order?.createdAt).format("LL")}</p>
          </label>
          <label htmlFor="Total amount" className="space-y-3">
            <h4 className="text-base font-medium text-gray-700">
              Total amount
            </h4>
            <p>{formatter.format(loaderData?.order?.total as number)}</p>
          </label>
          <label htmlFor="Items" className="space-y-3">
            <h4 className="text-base font-medium text-gray-700">Items</h4>
            <p>{loaderData?.order?.orderItems.length}</p>
          </label>

          <label htmlFor="status" className="space-y-3">
            <h4 className="text-base font-medium text-gray-700">Status</h4>
            <p
              className={`+ px-6 py-1 text-base uppercase  ${
                loaderData?.order?.status === "pending" &&
                "bg-gray-600 text-gray-50"
              }
                      ${
                        loaderData?.order?.status === "placed" &&
                        "bg-blue-600 text-blue-50"
                      }
                      ${
                        loaderData?.order?.status === "shipping" &&
                        "bg-yellow-600 text-yellow-50"
                      }
                      ${
                        loaderData?.order?.status === "deliverd" &&
                        "bg-green-600 text-green-50"
                      }
                    ${
                      loaderData?.order?.status === "cancelled" &&
                      "bg-red-600 text-red-50"
                    }

                    
                      `}
            >
              {loaderData?.order?.status}
            </p>
          </label>
        </div>
        <div className="flex w-full items-center justify-between p-4  lg:flex-col">
          {loaderData?.order?.orderItems.map((item) => (
            <div
              className="w-full  space-x-4 rounded-md border  p-4 lg:flex lg:flex-row"
              key={item.id}
            >
              <div className="lg:max-w-sm">
                <img
                  src={item.potato.imgUrl}
                  alt={item.potato.variety}
                  className="aspect-sqaure"
                />
              </div>
              <div className="flex flex-col space-y-4">
                <label htmlFor="variety">
                  <h4 className="text-xl font-medium text-gray-700">
                    {item.potato.variety}
                  </h4>
                </label>
                <label htmlFor="quantity">
                  <span className="text-base text-gray-700">
                    {item.quantity} Bags
                  </span>
                </label>
                <label htmlFor="amount">
                  <span className="text-base font-medium text-lime-500">
                    {" "}
                    {formatter.format(item.price)}
                  </span>
                </label>
                <label htmlFor="farm">
                  <span> {item.potato.farm.name}</span>
                </label>
                <label htmlFor="status" className="space-y-3">
                  <h4 className="text-base font-medium text-gray-700">
                    Status
                  </h4>
                  <p
                    className={`+ px-6 py-1 text-base uppercase  ${
                      item.status === "pending" && "bg-gray-600 text-gray-50"
                    }
                      ${item.status === "placed" && "bg-blue-600 text-blue-50"}
                      ${
                        item.status === "shipped" &&
                        "bg-yellow-600 text-yellow-50"
                      }
                      ${
                        item.status === "deliverd" &&
                        "bg-green-600 text-green-50"
                      }
                    ${item.status === "cancelled" && "bg-red-600 text-red-50"}

                    
                      `}
                  >
                    {item.status}
                  </p>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
