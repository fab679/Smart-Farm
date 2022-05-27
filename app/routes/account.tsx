import { Outlet } from "@remix-run/react";
import { MetaFunction } from "@remix-run/react/routeModules";
import { ActionFunction } from "@remix-run/server-runtime";
import { useState } from "react";
import AccountNav from "~/components/account/AccountNav";

import BottomNav from "~/components/BottomNav";
import CommandPalette from "~/components/CommandPalette";
import MainNav from "~/components/MainNav";
import { logout } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const logoutuser = formData.get("logout");
  if (typeof logoutuser === "string" && logoutuser === "logout") {
    return logout(request);
  }
  return null;
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Basket - Smart Farm",
  viewport: "width=device-width,initial-scale=1",
});

export default function dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative min-h-full w-full pb-10">
      <CommandPalette isOpen={isOpen} setIsOpen={setIsOpen} />
      <MainNav setIsOpen={setIsOpen} />
      <div className="container mx-auto flex flex-col space-y-6 px-4 lg:flex-row lg:space-x-5 lg:space-y-0 lg:px-0">
        <div className="w-full px-6 lg:max-w-[24rem]">
          <AccountNav />
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
