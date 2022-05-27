import { Outlet } from "@remix-run/react";

export default function Pay() {
  return (
    <div className="space-y-5sss flex min-h-full w-full flex-col items-center justify-center">
      <h1 className="text-base text-gray-700">Smart Farm Pay</h1>
      <Outlet />
    </div>
  );
}
