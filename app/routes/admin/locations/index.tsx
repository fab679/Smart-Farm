import { Form, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";

import { getAllAddress } from "~/models/admin.server";

interface LoaderData {
  address: Awaited<ReturnType<typeof getAllAddress>>;
}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>(
    {
      address: await getAllAddress(),
    },
    { status: 200 }
  );
};

export default function index() {
  const loaderData = useLoaderData() as LoaderData;
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Address
            </th>
            <th scope="col" className="px-6 py-3">
              Location
            </th>
            <th scope="col" className="px-6 py-3">
              Region
            </th>

            <th scope="col" className="px-6 py-3">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {loaderData.address.map((address, index) => {
            return (
              <tr
                className="border-b bg-white transition duration-150 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
                key={address.id}
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {address.name}
                </th>
                <td className="px-6 py-4">{address.location.name}</td>
                <td className="px-6 py-4">{address.location.region.name}</td>

                <td className="px-6 py-4 ">
                  <Form>
                    <button
                      type="button"
                      className="font-medium text-red-400  hover:text-red-600 dark:text-red-500"
                    >
                      delete
                    </button>
                  </Form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
