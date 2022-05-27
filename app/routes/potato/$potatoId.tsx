import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { useState } from "react";
import { findPotatoHarvest } from "~/models/potatoes.sever";
import { GrFormSubtract } from "react-icons/gr";
import { IoAdd } from "react-icons/io5";
import { CartState } from "~/context/Context";

interface LoaderData {
  potato: Awaited<ReturnType<typeof findPotatoHarvest>>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const potatoId = params?.potatoId as string;
  return json<LoaderData>(
    {
      potato: await findPotatoHarvest(potatoId),
    },
    {
      status: 200,
    }
  );
};

export default function index() {
  const loaderData = useLoaderData() as LoaderData;
  const [qty, setQty] = useState(1);
  const {
    state: { cart },
    dispatch,
  } = CartState();

  return (
    <div className="container mx-auto flex h-full w-full flex-col p-3 lg:flex-row">
      <div className="relative flex-1">
        <img src={loaderData.potato?.imgUrl} alt={loaderData.potato?.variety} />
      </div>
      <div className="flex-1 space-y-3">
        <h1 className="w-full text-center text-2xl font-semibold text-lime-500">
          {loaderData.potato?.variety} Potatoes
        </h1>
        <div className="space-y-3 py-3">
          <p className="w-full text-center text-xl">
            {loaderData.potato?.quantity} bags available
          </p>
          <p className="w-full text-center text-xl">
            Ksh{" "}
            <span className="text-lime-500">{loaderData.potato?.price}</span>{" "}
            per bag
          </p>
        </div>
        {cart.some((item: any) => item?.id === loaderData.potato?.id) ? null : (
          <div className="flex  w-full flex-col items-center justify-center">
            <p className="w-full text-center text-lg">
              <span className="text-xl font-semibold">qty</span>
            </p>

            <div className="flex items-center border p-1">
              <button
                className="p-3 shadow-sm"
                onClick={() => {
                  qty > 1 ? setQty(qty - 1) : setQty(1);
                }}
              >
                <GrFormSubtract className="h-6 w-6" />
              </button>
              <input
                type="number"
                name="qty"
                id="quanitity"
                className="w-10 appearance-none border-0 px-0 focus:border-0 focus:ring-0"
                min={1}
                max={loaderData.potato?.quantity}
                size={4}
                value={qty}
                onChange={(e) => {
                  setQty(Number(e.target.value));
                }}
                inputMode="numeric"
              />
              <button
                className="p-3 shadow-sm"
                onClick={() => {
                  setQty(qty + 1);
                }}
              >
                <IoAdd className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col items-center justify-center py-3">
          {cart.some((item: any) => item?.id === loaderData.potato?.id) ? (
            <button
              className="bg-red-500 px-10 py-2 text-lg font-medium text-red-50 active:bg-red-600"
              onClick={() => {
                dispatch({
                  type: "REMOVE_FROM_CART",
                  payload: {
                    id: loaderData.potato?.id,
                  },
                });
              }}
            >
              <span className="text-xl font-semibold">Remove from Cart</span>
            </button>
          ) : (
            <button
              className="bg-lime-500 px-10 py-2 text-lg font-medium text-lime-50 active:bg-lime-600"
              onClick={() => {
                dispatch({
                  type: "ADD_TO_CART",
                  payload: {
                    ...loaderData.potato,
                    qty,
                    price: loaderData.potato?.price,
                  },
                });
              }}
            >
              <span className="text-xl font-semibold">Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
