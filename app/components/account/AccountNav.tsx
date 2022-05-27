import { Form, NavLink } from "@remix-run/react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { RiTimeLine, RiSettings3Line } from "react-icons/ri";
import { IoMailUnreadOutline, IoLocationOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
export default function AccountNav() {
  return (
    <nav className="w-full divide-y rounded-xl bg-zinc-50 p-3 text-base text-gray-600 shadow-sm ">
      <div className="space-y-1">
        <NavLink
          to="/account"
          className={({ isActive }) =>
            isActive
              ? "flex items-center rounded-md bg-zinc-200 py-2 px-2 "
              : "flex items-center rounded-md py-2 px-2 "
          }
          end
        >
          <MdOutlineDashboardCustomize className="mr-2" />
          Dashboard
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) =>
            isActive
              ? "flex items-center rounded-md bg-zinc-200 py-2 px-2 "
              : "flex items-center rounded-md py-2 px-2 active:bg-zinc-200 "
          }
        >
          <RiTimeLine className="mr-2" />
          Orders
        </NavLink>
        <NavLink
          to="inbox"
          className={({ isActive }) =>
            isActive
              ? "flex items-center rounded-md bg-zinc-200 py-2 px-2 "
              : "flex items-center rounded-md py-2 px-2  "
          }
        >
          <IoMailUnreadOutline className="mr-2" />
          Inbox
        </NavLink>
        <NavLink
          to="address"
          className={({ isActive }) =>
            isActive
              ? "flex items-center rounded-md bg-zinc-200 py-2 px-2 "
              : "flex items-center rounded-md py-2 px-2  "
          }
        >
          <IoLocationOutline className="mr-2" />
          Address
        </NavLink>
        <NavLink
          to="details"
          className={({ isActive }) =>
            isActive
              ? "flex items-center rounded-md bg-zinc-200 py-2 px-2 "
              : "flex items-center rounded-md py-2 px-2  "
          }
        >
          <RiSettings3Line className="mr-2" />
          Account Details
        </NavLink>
      </div>
      <div className="flex justify-center py-2">
        <Form method="post" action="/account">
          <button
            type="submit"
            className="flex  items-center rounded-md px-2 py-2 text-lime-600"
            name="logout"
            value="logout"
          >
            {" "}
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </Form>
      </div>
    </nav>
  );
}
