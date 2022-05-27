import { Link } from "@remix-run/react";
import { MetaFunction } from "@remix-run/react/routeModules";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Address - Smart Farm",
  viewport: "width=device-width,initial-scale=1",
});

export default function address() {
  return (
    <div className="h-full w-full space-y-1 divide-y rounded-md  bg-white pb-10 shadow-md">
      <div className="flex w-full items-center justify-between px-3 py-2 ">
        <h2 className="text-xl font-medium text-gray-800 ">Address</h2>
        <Link
          to="."
          className="rounded-md bg-lime-500 px-3 py-2 text-lime-50 shadow-md shadow-lime-200 hover:bg-lime-600"
        >
          Add New Address
        </Link>
      </div>
      <div></div>
    </div>
  );
}
