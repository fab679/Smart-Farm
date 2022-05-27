import { useLoaderData, Link } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { getFarmersRequesting } from "~/models/admin.server";

interface LoaderData {
  farm: Awaited<ReturnType<typeof getFarmersRequesting>>;
}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>(
    {
      farm: await getFarmersRequesting(),
    },
    {
      status: 200,
    }
  );
};

export default function requests() {
  const loaderData = useLoaderData() as LoaderData;

  return (
    <div className="container mx-auto space-y-3">
      <div className="flex w-full items-center justify-center ">
        <h1 className="text-lg font-medium text-gray-800">Requests</h1>
      </div>
      <div className="space-y-4 p-3">
        {loaderData.farm?.length > 0 ? (
          <>
            {loaderData.farm.map((farmer) => {
              return (
                <div
                  className="flex w-full items-center justify-between rounded-md border p-2"
                  key={farmer.id}
                >
                  <label htmlFor="farmname" className="flex flex-col space-y-3">
                    <span>Farm Name</span>
                    <span className="text-sm text-gray-800">{farmer.name}</span>
                  </label>
                  <label
                    htmlFor="ownername"
                    className="flex flex-col space-y-3"
                  >
                    <span>Owner Name</span>
                    <span className="text-sm text-gray-800">
                      {farmer.farmowner?.firstname}
                    </span>
                  </label>
                  <label htmlFor="idno" className="flex flex-col space-y-3">
                    <span>ID Number</span>
                    <span className="text-sm text-gray-800">
                      {farmer.farmowner?.idNumber}
                    </span>
                  </label>
                  <label htmlFor="phone" className="flex flex-col space-y-3">
                    <span>Phone Number</span>
                    <span className="text-sm text-gray-800">
                      +254{farmer.farmowner?.phone}
                    </span>
                  </label>
                  <Link
                    to={`${farmer.id}`}
                    className="rounded-md border p-2 shadow-sm hover:bg-gray-100"
                  >
                    View
                  </Link>
                </div>
              );
            })}
          </>
        ) : (
          <div>
            <h1>No Requests</h1>
          </div>
        )}
      </div>
    </div>
  );
}
