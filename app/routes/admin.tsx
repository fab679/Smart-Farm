import { Form, Link, Outlet } from "@remix-run/react";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { adminLogout, getAdminId } from "~/session.server";
import { RiAdminFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { GoRequestChanges } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";

export const loader: LoaderFunction = async ({ request }) => {
  const adminId = await getAdminId(request);
  if (!adminId) return redirect("/adminlogin");
  return {};
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const logoutadmin = formData.get("logoutadmin");
  if (typeof logoutadmin === "string" && logoutadmin === "logoutadmin") {
    return adminLogout(request);
  }
  return {};
};

export default function admin() {
  return (
    <div className="relative block h-full w-full lg:flex lg:space-x-2">
      <nav
        className={`sticky top-0 right-0 hidden h-full w-[18rem] items-center  space-y-6 bg-white p-3 shadow-md  lg:flex lg:flex-col `}
      >
        <div className="flex w-full flex-col items-center  justify-center space-y-4">
          <Link
            to="/admin"
            className="flex text-base font-medium text-gray-800"
          >
            <RiAdminFill className="mr-2 h-6 w-6" /> Admin
          </Link>
        </div>
        <div className="block w-full py-3">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? "flex w-full items-center  rounded-md bg-lime-100 py-2  px-2 text-base capitalize text-lime-500"
                : "flex w-full items-center rounded-md py-2  px-2 text-base capitalize hover:text-lime-500"
            }
            end
          >
            <MdOutlineDashboardCustomize className="mr-2" />
            dashboard
          </NavLink>
          <NavLink
            to="requests"
            className={({ isActive }) =>
              isActive
                ? "flex w-full items-center  rounded-md bg-lime-100 py-2  px-2 text-base capitalize text-lime-500"
                : "flex w-full items-center rounded-md py-2  px-2 text-base capitalize hover:text-lime-500"
            }
          >
            <GoRequestChanges className="mr-2" />
            Requests
          </NavLink>
          <NavLink
            to="locations"
            className={({ isActive }) =>
              isActive
                ? "flex w-full items-center  rounded-md bg-lime-100 py-2  px-2 text-base capitalize text-lime-500"
                : "flex w-full items-center rounded-md py-2  px-2 text-base capitalize hover:text-lime-500"
            }
          >
            <IoLocationOutline className="mr-2" />
            Locations
          </NavLink>
          <NavLink
            to="pickups"
            className={({ isActive }) =>
              isActive
                ? "flex w-full items-center  rounded-md bg-lime-100 py-2  px-2 text-base capitalize text-lime-500"
                : "flex w-full items-center rounded-md py-2  px-2 text-base capitalize hover:text-lime-500"
            }
          >
            <GrMapLocation className="mr-2" />
            pickups
          </NavLink>
        </div>
        <div className="flex h-full flex-col justify-end">
          <Form method="post" action="/admin">
            <button
              type="submit"
              name="logoutadmin"
              value="logoutadmin"
              className="flex items-center rounded-md px-3 py-2 text-lime-500 hover:bg-red-100 hover:text-red-600"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </Form>
        </div>
      </nav>
      <div className="h-full w-full  overflow-y-auto py-3 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
