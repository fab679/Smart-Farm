import { Form, Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";

import { getAllPickUp } from "~/models/admin.server";

interface LoaderData {
  pickup: Awaited<ReturnType<typeof getAllPickUp>>;
}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>(
    {
      pickup: await getAllPickUp(),
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
              pickup
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
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
              update
            </th>
            <th scope="col" className="px-6 py-3">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {loaderData.pickup.length > 0 ? (
            <>
              {loaderData.pickup.map((pickup, index) => {
                return (
                  <tr
                    className="border-b bg-white transition duration-150 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    key={pickup.id}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {pickup.name}
                    </th>
                    <td className="px-6 py-4">{pickup.email}</td>
                    <td className="px-6 py-4">{pickup.address?.name}</td>
                    <td className="px-6 py-4">
                      {pickup.address?.location.name}
                    </td>
                    <td className="px-6 py-4">
                      {pickup.address?.location.region.name}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`${pickup.id}`}
                        className="font-medium text-blue-400  hover:text-blue-600 dark:text-blue-500"
                      >
                        update
                      </Link>
                    </td>

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
            </>
          ) : (
            <div>
              <h1>No Pickups</h1>
            </div>
          )}
        </tbody>
      </table>
    </div>
  );
}
