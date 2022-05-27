import { Link, Outlet } from "@remix-run/react";

export default function location() {
  return (
    <div className="container mx-auto space-y-4 p-5">
      <div className="flex w-full items-center justify-center text-center">
        <h1 className="text-lg font-semibold text-gray-700">Location</h1>
      </div>
      <div>
        <Link
          to="add"
          className="bg-lime-600 px-10 py-2 text-lime-50 shadow-md"
        >
          Add
        </Link>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
