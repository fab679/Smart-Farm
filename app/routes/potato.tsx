import { Outlet } from "@remix-run/react";
import { useState } from "react";
import BottomNav from "~/components/BottomNav";
import CommandPalette from "~/components/CommandPalette";
import MainNav from "~/components/MainNav";

export default function potato() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative min-h-full pb-10">
      <CommandPalette isOpen={isOpen} setIsOpen={setIsOpen} />
      <MainNav setIsOpen={setIsOpen} />
      <div>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
