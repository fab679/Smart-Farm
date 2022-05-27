import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { useState } from "react";

import { getAllLocation } from "~/models/address.server";
import { updateFarmAddress } from "~/models/farm.server";
import { getFarmId } from "~/session.server";

interface LoaderData {
  location: Awaited<ReturnType<typeof getAllLocation>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const farm = await getFarmId(request);
  if (!farm) {
    return redirect("/registerfarm");
  }
  return json<LoaderData>(
    {
      location: await getAllLocation(),
    },
    {
      status: 200,
    }
  );
};

interface ActionData {
  errors: {
    address?: string;
  };
}
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const addressId = formData.get("address");

  if (typeof addressId !== "string") {
    return json<ActionData>(
      { errors: { address: "Address is required" } },
      { status: 400 }
    );
  }

  const farm = await getFarmId(request);
  if (!farm) {
    return redirect("/registerfarm");
  }
  await updateFarmAddress(farm, addressId);
  return redirect(`/farm/`);
};

export default function address() {
  const loaderData = useLoaderData() as LoaderData;
  const [address, setAddress] = useState(loaderData.location[0].address);
  const location = loaderData.location;

  return (
    <div className="mt-10 block h-full w-full space-y-4">
      <div className="flex w-full flex-col items-center justify-center space-y-5">
        <h3 className="text-3xl">Step 2</h3>
        <p className="xl">Farm Address</p>
      </div>
      <div>
        <Form className="w-full space-y-10 p-2" method="post">
          <fieldset className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <label className=" w-full space-y-3" htmlFor="region">
              <p>Region</p>
              <input
                className="w-full focus:invalid:border-red-500 focus:invalid:ring-red-500"
                type="text"
                name="region"
                id="region"
                value="Embu"
                readOnly
                required
              />
            </label>
            <label className="w-full space-y-3" htmlFor="location">
              <p>Location</p>
              <select
                defaultValue={location[0]?.id}
                className="w-full"
                onChange={(event) => {
                  setAddress(location[Number(event.target.value)].address);
                }}
                name="location"
                required
              >
                {location?.map((location, index) => {
                  return (
                    <option className="p-2" key={index} value={index}>
                      {location.name}
                    </option>
                  );
                })}
              </select>
            </label>
          </fieldset>
          <fieldset className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <label className="w-full space-y-3" htmlFor="street">
              <p>Address</p>
              <select
                defaultValue={address[0]?.id}
                className="w-full"
                required
                name="address"
                disabled={address?.length < 1}
              >
                {address?.map((location) => {
                  return (
                    <option
                      className="p-2 "
                      key={location.id}
                      value={location.id}
                    >
                      {location.name}
                    </option>
                  );
                })}
              </select>
            </label>
          </fieldset>
          <fieldset className=" flex w-full justify-center ">
            <button className="w-full bg-lime-500 py-3 px-6 text-center text-lime-50 transition duration-300 hover:scale-110 hover:bg-lime-600 lg:w-96">
              Finish
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
