import { Outlet } from "@remix-run/react";
import { MetaFunction } from "@remix-run/react/routeModules";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Orders - Smart Farm",
  viewport: "width=device-width,initial-scale=1",
});

export default function orders() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
