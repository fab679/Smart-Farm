import { Link, Outlet } from "@remix-run/react";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { useEffect, useState } from "react";
import BottomNav from "~/components/BottomNav";
import CommandPalette from "~/components/CommandPalette";
import MainNav from "~/components/MainNav";
import { CartState } from "~/context/Context";

import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function Checkout() {
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const {
    state: { cart },
  } = CartState();
  useEffect(() => {
    setTotal(
      cart.reduce(
        (acc, curr: any) => acc + Number(curr?.price) * Number(curr?.qty),
        0
      )
    );
  }, [cart]);
  return (
    <div className="relative min-h-full pb-10">
      <CommandPalette isOpen={isOpen} setIsOpen={setIsOpen} />
      <MainNav setIsOpen={setIsOpen} />
      <div className="container mx-auto flex min-h-full w-full flex-col justify-between space-y-4 p-4 lg:flex-row lg:justify-evenly lg:space-x-5 lg:space-y-0">
        <div className="w-full space-y-3 p-3">
          <h3 className="text-lg font-medium">Checkout</h3>
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
