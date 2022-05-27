import { Outlet } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import FarmMainNav from "~/components/farm/FarmMainNav";
import FarmMobilenav from "~/components/farm/FarmMobilenav";
import { GetFarmById } from "~/models/farm.server";
import { farmLogout, getFarmId } from "~/session.server";

export interface FarmLoaderData {
  farm: Awaited<ReturnType<typeof GetFarmById>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const farm = await getFarmId(request);
  if (!farm) {
    return redirect("/registerfarm");
  }

  return json<FarmLoaderData>(
    {
      farm: await GetFarmById(farm),
    },
    {
      status: 200,
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const logoutfarm = formData.get("logoutfarm");
  if (typeof logoutfarm === "string" && logoutfarm === "logoutfarm") {
    return farmLogout(request);
  }
  return {};
};

export default function farm() {
  return (
    <div className="relative block h-full w-full lg:flex lg:space-x-2">
      <FarmMainNav />
      <FarmMobilenav />
      <div className="h-full w-full  overflow-y-auto py-3 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
