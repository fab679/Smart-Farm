import { Form, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { useState } from "react";
import BottomNav from "~/components/BottomNav";
import CommandPalette from "~/components/CommandPalette";
import MainNav from "~/components/MainNav";
import { GoSettings } from "react-icons/go";
import Card from "~/components/Card";

import { getPotatoHarvest } from "~/models/potatoes.sever";

interface LoaderData {
  potato: Awaited<ReturnType<typeof getPotatoHarvest>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>(
    {
      potato: await getPotatoHarvest(),
    },
    {
      status: 200,
    }
  );
};
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Shop Now - Smart Farm",
  viewport: "width=device-width,initial-scale=1",
});

export default function shop() {
  const [isOpen, setIsOpen] = useState(false);
  const loaderData = useLoaderData() as LoaderData;
  return (
    <div className="relative min-h-full bg-zinc-50 pb-10">
      <CommandPalette isOpen={isOpen} setIsOpen={setIsOpen} />
      <MainNav setIsOpen={setIsOpen} />
      <div className="flex w-full items-center justify-center py-6">
        <h3 className="text-3xl text-gray-800">Shop</h3>
      </div>
      <div className="flex flex-col bg-white lg:flex-row lg:space-x-2">
        <div className="flex px-4 py-6 lg:hidden">
          <Form>
            <button className="flex items-center text-lg">
              <GoSettings className="mr-2" /> Filters
            </button>
          </Form>
        </div>
        <nav className="hidden h-full min-w-[18rem] p-2 lg:flex ">
          Filter Bar
        </nav>
        <div className="flex h-full w-full justify-center p-2 ">
          <div className="flex w-full  flex-row flex-wrap   justify-center ">
            {loaderData.potato.map((item) => {
              return <Card key={item.id} data={item} />;
            })}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
