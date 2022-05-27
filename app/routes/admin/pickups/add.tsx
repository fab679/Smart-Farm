import { Form, useLoaderData, useTransition } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { useRef, useState } from "react";
import Loader from "~/components/Loader";
import { createPickUp, getAllRegion } from "~/models/admin.server";

interface LoaderData {
  regions: Awaited<ReturnType<typeof getAllRegion>>;
}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>(
    {
      regions: await getAllRegion(),
    },
    { status: 200 }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const address = formData.get("address");
  const pickupstationname = formData.get("pickupstationname");
  const pickupstationpassword = formData.get("pickupstationpassword");
  const pickupstationemail = formData.get("pickupstationemail");
  if (
    typeof address === "string" &&
    typeof pickupstationname === "string" &&
    typeof pickupstationpassword === "string" &&
    typeof pickupstationemail === "string"
  ) {
    await createPickUp(
      pickupstationname,
      pickupstationemail,
      pickupstationpassword,
      address
    );
    redirect("/admin/pickups");
  }
  return json({}, { status: 200 });
};

export default function index() {
  const loaderData = useLoaderData() as LoaderData;
  const addressRef = useRef<HTMLFormElement>(null);
  const [location, setLocation] = useState(loaderData.regions[0].location);
  const [address, setAddress] = useState(
    loaderData.regions[0].location[0].address
  );
  const transition = useTransition();
  let addAddressLoading =
    transition.state === "loading" &&
    transition.submission?.formData.get("addaddress") === "addaddress";

  return (
    <div className="container mx-auto w-full space-y-8 p-5">
      {loaderData.regions.length > 0 &&
        loaderData.regions[0].location.length > 0 && (
          <section className="flex w-full rounded-sm p-10 shadow-md">
            <Form
              method="post"
              className="relative block w-full space-y-8"
              ref={addressRef}
            >
              {addAddressLoading && <Loader />}
              <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
                <label
                  className="flex w-full  flex-col-reverse space-y-3"
                  htmlFor="region"
                >
                  <select
                    className="peer focus:border-lime-500 focus:ring-0"
                    onChange={(e) => {
                      setLocation(
                        loaderData.regions[Number(e.target.value)].location
                      );
                    }}
                  >
                    {loaderData.regions.map((region, index) => {
                      return (
                        <option key={region.id} value={index}>
                          {region.name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                    Variety
                  </p>
                </label>
                <label
                  className="flex w-full  flex-col-reverse space-y-3"
                  htmlFor="location"
                >
                  <select
                    name="locationId"
                    id="locationId"
                    className="peer focus:border-lime-500 focus:ring-0"
                    onChange={(e) => {
                      setAddress(
                        loaderData.regions[0].location[Number(e.target.value)]
                          .address
                      );
                    }}
                  >
                    {location.map((location, index) => {
                      return (
                        <option key={location.id} value={index}>
                          {location.name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                    Location
                  </p>
                </label>
              </fieldset>

              <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
                <label
                  htmlFor="Address"
                  className="flex w-full  flex-col-reverse"
                >
                  <select
                    name="address"
                    id="address"
                    className="peer focus:border-lime-500 focus:ring-0"
                    defaultValue={address[0]?.id}
                  >
                    {address.map((address, index) => {
                      return (
                        <option key={address?.id} value={address?.id}>
                          {address?.name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                    Address
                  </p>
                </label>
                <label
                  htmlFor="pickupstationemail"
                  className="flex w-full  flex-col-reverse"
                >
                  <input
                    type="email"
                    name="pickupstationemail"
                    className="peer w-full border-0 border-b text-lg  text-gray-700 placeholder:text-gray-300 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                    placeholder=""
                    autoFocus
                    required
                  />
                  <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                    Pickupstation Email
                  </p>
                </label>
              </fieldset>
              <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
                <label
                  htmlFor="pickupstationname"
                  className="flex w-full  flex-col-reverse"
                >
                  <input
                    type="text"
                    name="pickupstationname"
                    className="peer w-full border-0 border-b text-lg capitalize text-gray-700 placeholder:text-gray-300 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                    placeholder=""
                    autoFocus
                    required
                  />
                  <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                    Pickupstation Name
                  </p>
                </label>
                <label
                  htmlFor="pickupstationpassword"
                  className="flex w-full  flex-col-reverse"
                >
                  <input
                    type="password"
                    name="pickupstationpassword"
                    className="peer w-full border-0 border-b text-lg capitalize text-gray-700 placeholder:text-gray-300 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                    placeholder=""
                    required
                  />
                  <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                    Pickupstation Password
                  </p>
                </label>
              </fieldset>
              <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
                <button
                  type="submit"
                  name="addlocation"
                  value="addlocation"
                  className="w-full rounded-md bg-lime-500 p-3 text-center font-medium uppercase text-lime-50 shadow-md shadow-lime-200 hover:bg-lime-600 hover:text-white"
                >
                  Add
                </button>
              </fieldset>
            </Form>
          </section>
        )}
    </div>
  );
}
