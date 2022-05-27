import { NavLink, Outlet, useLoaderData } from "@remix-run/react";

export default function orders() {
  return (
    <div className="container mx-auto h-full w-full space-y-2 px-3 shadow-sm ">
      <div className="flex w-full justify-center lg:justify-start">
        <h2 className="text-2xl text-gray-700">Orders</h2>
      </div>
      <nav className="flex items-center justify-between text-xl text-gray-700">
        <NavLink
          to="/farm/orders"
          className={({ isActive }) =>
            isActive
              ? "flex items-center rounded-md py-2 px-2 text-lime-500 "
              : "flex items-center rounded-md py-2 px-2  "
          }
          end
        >
          Pending
        </NavLink>
        <NavLink
          to="shipped"
          className={({ isActive }) =>
            isActive
              ? "flex items-center rounded-md py-2 px-2 text-lime-500 "
              : "flex items-center rounded-md py-2 px-2  "
          }
        >
          In Transit
        </NavLink>
        <NavLink
          to="completed"
          className={({ isActive }) =>
            isActive
              ? "flex items-center rounded-md py-2 px-2 text-lime-500 "
              : "flex items-center rounded-md py-2 px-2  "
          }
        >
          Completed
        </NavLink>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
