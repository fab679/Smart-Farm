import { Link, Outlet } from "@remix-run/react";

export default function inventory() {
  return (
    <div className="h-full w-full space-y-2 p-2 shadow-sm">
      <div className="flex w-full justify-center lg:justify-start">
        <h2 className="text-2xl text-gray-700">Inventory</h2>
      </div>
      <nav>
        <Link
          to="add"
          className="rounded-md bg-lime-500 px-4 py-2 text-base uppercase text-lime-50 hover:bg-lime-600"
        >
          Add
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
