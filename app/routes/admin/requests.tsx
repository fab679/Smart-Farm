import { Outlet } from "@remix-run/react";

export default function requests() {
  return (
    <div className="container mx-auto space-y-3">
      <Outlet />
    </div>
  );
}
