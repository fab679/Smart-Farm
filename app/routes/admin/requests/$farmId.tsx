import { Form, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { getFarm, verifyFarm } from "~/models/admin.server";

interface LoaderData {
  farm: Awaited<ReturnType<typeof getFarm>>;
}

export const loader: LoaderFunction = async ({ params }) => {
  const farmId = params.farmId as string;
  return json<LoaderData>(
    {
      farm: await getFarm(farmId),
    },
    {
      status: 200,
    }
  );
};

export const action: ActionFunction = async ({ params }) => {
  const farmId = params.farmId as string;
  const farm = await verifyFarm(farmId);
  if (farm) {
    return redirect(`/admin/requests`);
  }
  return json({}, { status: 400 });
};

export default function index() {
  const loaderData = useLoaderData() as LoaderData;

  return (
    <div className="container mx-auto p-10">
      <div className=" space-y-4 rounded-md p-3 shadow-md">
        <div className="flex justify-between">
          <div className="flex-1 space-y-3">
            <label htmlFor="farmName" className="flex space-x-3">
              <p>Farm Name</p>
              <h1 className="text-lg font-medium text-gray-800">
                {loaderData.farm?.name}
              </h1>
            </label>
            <label htmlFor="ownersName" className="flex space-x-3">
              <p> Owners Name:</p>
              <h1 className="text-lg font-medium text-gray-800">
                <span>{loaderData.farm?.farmowner?.firstname}</span>,{" "}
                <span>{loaderData.farm?.farmowner?.lastname}</span>
              </h1>
            </label>
            <label htmlFor="region" className="flex space-x-3">
              <p>Region:</p>
              <h1 className="text-lg font-medium text-gray-800">
                <span>{loaderData.farm?.address?.location.region.name}</span>
              </h1>
            </label>
            <label htmlFor="district" className="flex space-x-3">
              <p>District:</p>
              <h1 className="text-lg font-medium text-gray-800">
                <span>{loaderData.farm?.address?.location.name}</span>,{" "}
              </h1>
            </label>
            <label htmlFor="farmAddress" className="flex space-x-3">
              <p>Farm Address:</p>
              <h1 className="text-lg font-medium text-gray-800">
                <span> {loaderData.farm?.address?.name}</span>,{" "}
              </h1>
            </label>
            <label htmlFor="farmPhone" className="flex space-x-3">
              <p>Farm Phone:</p>
              <h1 className="text-lg font-medium text-gray-800">
                {loaderData.farm?.farmowner?.phone}
              </h1>
            </label>
            <label htmlFor="farmEmail" className="flex space-x-3">
              <p>Farm Email:</p>
              <h1 className="text-lg font-medium text-gray-800">
                {loaderData.farm?.email}
              </h1>
            </label>
            <label htmlFor="owneridno" className="flex space-x-3">
              <p>Owner ID Number:</p>
              <h1 className="text-lg font-medium text-gray-800">
                {loaderData.farm?.farmowner?.idNumber}
              </h1>
            </label>
          </div>
          <div className="flex-1 p-3">
            <label htmlFor="id">
              <p>Owner ID:</p>
              <img
                src={loaderData.farm?.farmowner?.frontIdImageUrl}
                alt="idcard"
                className="h-48"
              />
            </label>
          </div>
        </div>
        <Form
          method="post"
          className="flex w-full items-center justify-center p-3"
        >
          <fieldset>
            <input type="hidden" name="id" value={loaderData.farm?.id} />
          </fieldset>
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Approve
          </button>
        </Form>
      </div>
    </div>
  );
}
