import { Link, Outlet } from "@remix-run/react";

export default function registerfarm() {
  return (
    <div className="container mx-auto h-full w-full space-y-4 divide-y bg-white">
      <div className="flex w-full flex-col justify-center space-y-5 p-3">
        <Link to={"/"} className="text-center text-4xl font-bold text-gray-700">
          Smart<span className="text-lime-500">Farm</span>
        </Link>
        <h1 className="text-center text-4xl font-bold text-gray-700">
          Welcome to Smart<span className="text-lime-500">Farm</span>{" "}
          Registration.
        </h1>
        <p className="text-center text-base ">
          We value our clients and we want to provide the best quality produce
          in the market, please complete our 3 step registration processes and
          await for verfification.
        </p>
      </div>
      <div className="h-full w-full">
        <Outlet />
      </div>
    </div>
  );
}
