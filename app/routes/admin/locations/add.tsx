import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
} from "@remix-run/server-runtime";
import { useEffect, useRef, useState } from "react";
import Loader from "~/components/Loader";
import {
  addAddress,
  addLocation,
  addRegion,
  getAllRegion,
} from "~/models/admin.server";

interface LoaderData {
  regions: Awaited<ReturnType<typeof getAllRegion>>;
}

export const loader: LoaderFunction = async ({}) => {
  return json<LoaderData>(
    {
      regions: await getAllRegion(),
    },
    {
      status: 200,
    }
  );
};

interface ActionData {
  addRegion?: Awaited<ReturnType<typeof addRegion>>;
  addLocation?: Awaited<ReturnType<typeof addLocation>>;
  addAddress?: Awaited<ReturnType<typeof addAddress>>;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const region = formData.get("region");
  const regionId = formData.get("regionId");
  const location = formData.get("location");
  const locationId = formData.get("locationId");
  const address = formData.get("address");
  const addregion = formData.get("addregion");
  const addlocation = formData.get("addlocation");
  const addaddress = formData.get("addaddress");

  if (
    typeof addregion === "string" &&
    addregion === "addregion" &&
    typeof region === "string"
  ) {
    return json<ActionData>(
      {
        addRegion: await addRegion(region),
      },
      {
        status: 200,
      }
    );
  }
  if (
    typeof addlocation === "string" &&
    addlocation === "addlocation" &&
    typeof location === "string" &&
    typeof regionId === "string"
  ) {
    console.log(regionId, location);
    return json<ActionData>(
      {
        addLocation: await addLocation(location, regionId),
      },
      {
        status: 200,
      }
    );
  }
  if (
    typeof addaddress === "string" &&
    addaddress === "addaddress" &&
    typeof address === "string" &&
    typeof locationId === "string"
  ) {
    return json<ActionData>(
      {
        addAddress: await addAddress(locationId, address),
      },
      {
        status: 200,
      }
    );
  }
  return json<ActionData>({}, { status: 200 });
};

export default function add() {
  const loaderData = useLoaderData() as LoaderData;
  const regionRef = useRef<HTMLFormElement>(null);
  const locationRef = useRef<HTMLFormElement>(null);
  const addressRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData() as ActionData;
  const [location, setLocation] = useState(loaderData.regions[0]?.location);

  const transition = useTransition();
  let addRegionLoading =
    transition.state === "loading" &&
    transition.submission?.formData.get("addregion") === "addregion";
  let addLocationLoading =
    transition.state === "loading" &&
    transition.submission?.formData.get("addlocation") === "addlocation";
  let addAddressLoading =
    transition.state === "loading" &&
    transition.submission?.formData.get("addaddress") === "addaddress";
  useEffect(() => {
    if (actionData?.addRegion) {
      regionRef.current?.reset();
    }
    if (actionData?.addLocation) {
      locationRef.current?.reset();
      setLocation(loaderData.regions[0]?.location);
    }
    if (actionData?.addAddress) {
      addressRef.current?.reset();
    }
  }, [actionData, location, loaderData]);
  return (
    <div className="container mx-auto w-full space-y-8 p-5">
      <section className="flex w-full rounded-sm p-10 shadow-md">
        <Form method="post" className="relative w-full" ref={regionRef}>
          {addRegionLoading && <Loader />}
          <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
            <label htmlFor="Region" className="flex w-full  flex-col-reverse">
              <input
                type="text"
                name="region"
                className="peer w-full border-0 border-b text-lg capitalize text-gray-700 placeholder:text-gray-300 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                placeholder="Embu, Nairobi ....."
                autoFocus
                required
              />
              <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                Region
              </p>
            </label>
            <button
              type="submit"
              name="addregion"
              value="addregion"
              className="w-full rounded-md bg-lime-500 p-3 text-center font-medium uppercase text-lime-50 shadow-md shadow-lime-200 hover:bg-lime-600 hover:text-white"
            >
              Add
            </button>
          </fieldset>
        </Form>
      </section>
      {loaderData.regions.length > 0 && (
        <section className="flex w-full rounded-sm p-10 shadow-md">
          <Form
            method="post"
            className="relative block w-full space-y-8"
            ref={locationRef}
          >
            {addLocationLoading && <Loader />}
            <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
              <label
                className="flex w-full  flex-col-reverse space-y-3"
                htmlFor="region"
              >
                <select
                  name="regionId"
                  id="regionId"
                  className="peer focus:border-lime-500 focus:ring-0"
                >
                  {loaderData.regions.map((region) => {
                    return (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    );
                  })}
                </select>
                <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                  Region
                </p>
              </label>
              <label
                htmlFor="Location"
                className="flex w-full  flex-col-reverse"
              >
                <input
                  type="text"
                  name="location"
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 placeholder:text-gray-300 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                  placeholder="Embu, Nairobi ....."
                  autoFocus
                  required
                />
                <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                  Location
                </p>
              </label>
            </fieldset>
            <fieldset className="w-full p-2">
              <button
                type="submit"
                name="addlocation"
                value="addlocation"
                className="w-full rounded-md bg-lime-500 p-3 text-center font-medium uppercase text-lime-50 shadow-md shadow-lime-200 hover:bg-lime-600 hover:text-white"
              >
                add
              </button>
            </fieldset>
          </Form>
        </section>
      )}
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
                    {loaderData.regions?.map((region, index) => {
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
                    required
                  >
                    {location?.map((location) => {
                      return (
                        <option key={location.id} value={location.id}>
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
                  <input
                    type="text"
                    name="address"
                    className="peer w-full border-0 border-b text-lg capitalize text-gray-700 placeholder:text-gray-300 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                    placeholder=""
                    autoFocus
                    required
                  />
                  <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                    Address
                  </p>
                </label>
                <button
                  type="submit"
                  name="addaddress"
                  value="addaddress"
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
