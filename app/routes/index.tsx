import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { useState } from "react";
import BottomNav from "~/components/BottomNav";
import Card from "~/components/Card";
import CommandPalette from "~/components/CommandPalette";
import MainNav from "~/components/MainNav";

import { getPotatoHarvest } from "~/models/potatoes.sever";

interface LoaderData {
  potato: Awaited<ReturnType<typeof getPotatoHarvest>>;
}

export const loader: LoaderFunction = async ({  }) => {
  return json<LoaderData>(
    {
      potato: await getPotatoHarvest(),
    },
    {
      status: 200,
    }
  );
};

export default function index() {
  const [isOpen, setIsOpen] = useState(false);
  const loaderData = useLoaderData() as LoaderData;

  return (
    <div className="relative min-h-full pb-10">
      <CommandPalette isOpen={isOpen} setIsOpen={setIsOpen} />
      <MainNav setIsOpen={setIsOpen} />

      <section className="flex flex-col  lg:flex-row-reverse lg:justify-between">
        <div className="w-full">
          <img src="/potato.webp" alt="potato3D" className="w-full" />
        </div>
        <div className="flex w-full flex-col items-center justify-center  space-y-6">
          <h1 className="px-6 text-center text-4xl text-lime-700">
            The Best Potatoes For You.
          </h1>
          <p className="text-xl">
            Acquire fresh potatoes straight from the farm.
          </p>
          <Link
            to="/shop"
            className="animate-bounce border border-lime-300 px-4 py-3 text-xl uppercase text-lime-600"
          >
            Shop Now
          </Link>
        </div>
      </section>
      <section className="container mx-auto mt-5 space-y-3 px-4 pb-14 lg:px-0 lg:pb-4">
        <div className="flex items-center justify-center">
          <h3 className="text-3xl font-semibold text-gray-900">Featured</h3>
        </div>
        <div className="flex w-full  flex-row flex-wrap   ">
          {loaderData.potato.length > 0 ? (
            <>
              {loaderData.potato.map((item) => {
                return <Card key={item.id} data={item} />;
              })}
            </>
          ) : (
            <div>
              <p className="text-center text-xl">No Current Items</p>
            </div>
          )}
        </div>
      </section>
      <section className="container mx-auto mt-5 space-y-3 px-4 pb-14 lg:px-0 lg:pb-4">
        <div className="flex items-center justify-center text-center">
          <h3 className="text-2xl font-semibold text-gray-800">
            Smart Farm offers you convinient shopping experience of potatoes at
            any scale
          </h3>
        </div>
        <div className="flex w-full flex-col items-center justify-center space-y-3 py-6 lg:flex-row lg:justify-between lg:space-y-0">
          <div className="flex w-full flex-col items-center justify-center space-y-5">
            <div className="relative ">
              <img src="/order.webp" alt="order" />
            </div>

            <div className="flex flex-col items-center justify-center space-y-5 text-center">
              <h4 className="text-xl  text-gray-500">Order</h4>
              <p>
                Order multiple potatoes from different farms with ease from your
                prefered location
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center space-y-5">
            <div className="relative ">
              <img src="/delivery.webp" alt="delivery" />
            </div>
            <div className="flex flex-col items-center justify-center space-y-5 text-center">
              <h4 className="text-xl  text-gray-500">Delivery</h4>
              <p>
                Get your potatoes delivered to your home at your convience
                hustle less.
              </p>
            </div>
          </div>
          <div className="relative flex w-full flex-col items-center justify-center space-y-5">
            <div className="relative ">
              <img src="/return.webp" alt="return" />
            </div>
            <div className="flex flex-col items-center justify-center space-y-5 text-center">
              <h4 className="text-xl  text-gray-500">Return</h4>
              <p>
                Return the goods if they did not meet your expectations, we
                always want to offer you the best and we hope it doesn't come to
                this <span className="text-lg text-red-600">!</span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <BottomNav />
    </div>
  );
}
