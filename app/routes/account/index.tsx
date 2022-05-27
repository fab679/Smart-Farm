import { Link, useLoaderData } from "@remix-run/react";
import { MdModeEditOutline } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { getUserId } from "~/session.server";
import { getUserById } from "~/models/user.server";
interface LoaderData {
  user: Awaited<ReturnType<typeof getUserById>>;
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = (await getUserId(request)) as string;
  return json<LoaderData>(
    {
      user: await getUserById(user),
    },
    {
      status: 200,
    }
  );
};

export default function index() {
  const loaderData = useLoaderData() as LoaderData;
  return (
    <div className="h-full w-full space-y-1 divide-y rounded-md  bg-white pb-10 shadow-md">
      <div className="flex w-full justify-center p-3 lg:justify-start">
        <h2 className="text-xl font-medium text-gray-800 ">Account Overview</h2>
      </div>

      <div className="grid grid-flow-row items-center gap-8 px-3 py-3 pb-1 lg:grid-cols-2 lg:gap-1">
        {/* Card Components */}
        <div className="w-full max-w-md divide-y rounded-md border py-2 shadow-md lg:rounded-md">
          <div className="flex items-center justify-between p-2 text-lg font-medium text-gray-700 shadow-sm">
            <h5>Account Details</h5>
            <Link to="details" className="text-lime-600">
              <MdModeEditOutline className="h-6 w-6" />
            </Link>
          </div>
          <div className="space-y-2 p-2">
            <div className="spaxe-y-1">
              <h5 className="text-lg text-gray-700">{loaderData.user?.name}</h5>
              <p className=" text-gray-400">{loaderData.user?.email}</p>
            </div>
          </div>
          <div className="flex w-full flex-col justify-end p-2">
            <Link
              to="details#changepassword"
              className="text-lg font-medium uppercase text-lime-600"
            >
              {" "}
              Change Password
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md divide-y rounded-md border py-2 shadow-md lg:rounded-md">
          <div className="flex items-center justify-between p-2 text-lg font-medium text-gray-700 shadow-sm">
            <h5>Address Book</h5>
            <Link to="address" className="text-lime-600">
              <MdModeEditOutline className="h-6 w-6" />
            </Link>
          </div>
          <div className="space-y-2 p-2">
            <div className="spaxe-y-1">
              <h5 className="t capitalize text-gray-400">
                your default shipping Address
              </h5>
              <p className="  text-gray-700">{loaderData.user?.name}</p>
              <p className="  text-gray-700">
                {loaderData.user?.address[0]?.location?.region?.name}
              </p>
              <p className="  text-gray-700">
                {" "}
                <span>
                  {loaderData.user?.address[0]?.location?.name}
                </span> - <span>{loaderData.user?.address[0]?.name}</span>,{" "}
                <span>
                  {loaderData.user?.address[0]?.location?.region?.name}
                </span>
              </p>
              <p className="  text-gray-700">+254 {loaderData.user?.phone}</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md divide-y rounded-md border py-2 shadow-md lg:rounded-md">
          <div className="flex items-center justify-between p-2 text-lg font-medium text-gray-700 shadow-sm">
            <h5> Newsletter Preference</h5>
            <Link to="." className="text-lime-600">
              <MdModeEditOutline className="h-6 w-6" />
            </Link>
          </div>
          <div className="space-y-2 p-2">
            <div className="spaxe-y-1">
              <h5 className="t capitalize text-gray-400">
                You are currently subscribed to following newsletters:
              </h5>
              <p className="  flex items-center text-gray-700">
                <AiOutlineCheck className="mr-2" /> daily newsletters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
