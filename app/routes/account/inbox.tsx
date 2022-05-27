import { MetaFunction } from "@remix-run/react/routeModules";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Inbox - Smart Farm",
  viewport: "width=device-width,initial-scale=1",
});

export default function inbox() {
  return (
    <div className="h-full w-full space-y-1 divide-y rounded-md  bg-white pb-10 shadow-md">
      <div className="flex w-full justify-center p-3 lg:justify-start">
        <h2 className="text-xl font-medium text-gray-800 ">Inbox</h2>
      </div>
    </div>
  );
}
