import { Form, Link, NavLink, useLoaderData } from "@remix-run/react";
import {
  MdOutlineDashboardCustomize,
  MdOutlineInventory,
} from "react-icons/md";
import { RiTimeLine, RiSettings3Line } from "react-icons/ri";
import { FaFileInvoice } from "react-icons/fa";
import { IoMailUnreadOutline, IoLocationOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { FarmLoaderData } from "~/routes/farm";

export default function FarmMainNav() {
  const farmLoaderData = useLoaderData() as FarmLoaderData;
  return (
    <nav
      className={`sticky top-0 right-0 hidden h-full w-[18rem] items-center  space-y-6 bg-white p-3 shadow-md  lg:flex lg:flex-col `}
    >
      <div className="flex w-full flex-col items-center  justify-center space-y-4">
        <Link to="/" className="text-4xl">
          <span className="font-semibold text-lime-600">Smart</span>
          <span className="text-gray-800">Farm</span>
        </Link>
        <h3 className="text-base ">{farmLoaderData.farm?.name}</h3>
      </div>
      <div className="block w-full py-3">
        <NavLink
          to="/farm"
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
          to="inventory"
          className={({ isActive }) =>
            isActive
              ? "flex w-full items-center  rounded-md bg-lime-100 py-2  px-2 text-base capitalize text-lime-500"
              : "flex w-full items-center rounded-md py-2  px-2 text-base capitalize hover:text-lime-500"
          }
        >
          <MdOutlineInventory className="mr-2" />
          Inventory
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) =>
            isActive
              ? "flex w-full items-center  rounded-md bg-lime-100 py-2  px-2 text-base capitalize text-lime-500"
              : "flex w-full items-center rounded-md py-2  px-2 text-base capitalize hover:text-lime-500"
          }
        >
          <RiTimeLine className="mr-2" />
          Orders
        </NavLink>
        <NavLink
          to="invoices"
          className={({ isActive }) =>
            isActive
              ? "flex w-full items-center  rounded-md bg-lime-100 py-2  px-2 text-base capitalize text-lime-500"
              : "flex w-full items-center rounded-md py-2  px-2 text-base capitalize hover:text-lime-500"
          }
        >
          <FaFileInvoice className="mr-2" />
          Invoices
        </NavLink>
        <NavLink
          to="inbox"
          className={({ isActive }) =>
            isActive
              ? "flex w-full items-center  rounded-md bg-lime-100 py-2  px-2 text-base capitalize text-lime-500"
              : "flex w-full items-center rounded-md py-2  px-2 text-base capitalize hover:text-lime-500"
          }
        >
          <IoMailUnreadOutline className="mr-2" />
          Inbox
        </NavLink>
        <NavLink
          to="account"
          className={({ isActive }) =>
            isActive
              ? "flex w-full items-center  rounded-md bg-lime-100 py-2  px-2 text-base capitalize text-lime-500"
              : "flex w-full items-center rounded-md py-2  px-2 text-base capitalize hover:text-lime-500"
          }
        >
          <RiSettings3Line className="mr-2" />
          Account Settings
        </NavLink>
      </div>
      <div className="flex h-full flex-col justify-end">
        <Form method="post" action="/farm">
          <button
            type="submit"
            name="logoutfarm"
            value="logoutfarm"
            className="flex items-center rounded-md px-3 py-2 text-lime-500 hover:bg-red-100 hover:text-red-600"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </Form>
      </div>
    </nav>
  );
}
