import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { useEffect, useState } from "react";
import Loader from "~/components/Loader";
import { CartState } from "~/context/Context";

import { getAllRegion } from "~/models/admin.server";
import { addOrderItem, placeOrder } from "~/models/orders.server";
import { getUserById, updateUserAddress } from "~/models/user.server";
import { getUserId } from "~/session.server";

interface LoaderData {
  user: Awaited<ReturnType<typeof getUserById>>;
  regions: Awaited<ReturnType<typeof getAllRegion>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = (await getUserId(request)) as string;
  return json<LoaderData>(
    {
      user: await getUserById(user),
      regions: await getAllRegion(),
    },
    { status: 200 }
  );
};

interface ActionData {
  address?: Awaited<ReturnType<typeof updateUserAddress>>;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const address = formData.get("address");
  const addaddress = formData.get("addaddress");
  const placeorder = formData.get("placeorder");
  const total = formData.get("total");
  const addressId = formData.get("addressId");
  const orderitems = JSON.parse(formData.get("orderitems") as string);

  const user = (await getUserId(request)) as string;

  if (
    typeof address === "string" &&
    typeof addaddress === "string" &&
    addaddress === "addaddress"
  ) {
    return json<ActionData>(
      {
        address: await updateUserAddress(user, address),
      },
      { status: 200 }
    );
  }
  if (
    typeof placeorder === "string" &&
    placeorder === "placeorder" &&
    typeof total === "string"
  ) {
    const data = {
      total: parseInt(total),
      userId: user,
      addressId: addressId,
    };
    const order = await placeOrder(data);
    orderitems.forEach(async (item: any) => {
      await addOrderItem(item, order.id as string);
    });
    return redirect(`/pay/${order.id}`);
  }
  return json({}, { status: 200 });
};

export default function Checkout() {
  const loaderData = useLoaderData() as LoaderData;

  const [location, setLocation] = useState(loaderData.regions[0].location);
  const [address, setAddress] = useState(
    loaderData.regions[0].location[0].address
  );
  const [total, setTotal] = useState(0);

  const transition = useTransition();
  let addAddressLoading =
    transition.state === "loading" &&
    transition.submission?.formData.get("addaddress") === "addaddress";
  const {
    state: { cart },
  } = CartState();
  useEffect(() => {
    setTotal(
      cart.reduce(
        (acc, curr: any) => acc + Number(curr?.price) * Number(curr?.qty),
        0
      )
    );
  }, [cart]);
  return (
    <div className="relative min-h-full pb-10">
      <section className="p-4">
        {(loaderData.user?.address?.length as number) > 0 ? (
          <div className="max-w-md divide-y rounded-md shadow">
            <div className="p-3">
              <Link
                to="/account/details"
                className="rounded-sm bg-lime-500 px-5 py-2 text-lime-50 shadow-sm hover:bg-lime-600"
              >
                Change Address
              </Link>
            </div>
            <div className="space-y-3 p-3">
              <label className="space-y-2" htmlFor="address">
                <p>Address</p>
                <p className="text-base text-gray-600">
                  <span> {loaderData.user?.address[0].name as string}</span>,
                  {""}
                  <span>
                    {" "}
                    {loaderData.user?.address[0]?.location.name}
                  </span>,{" "}
                  <span>
                    {" "}
                    {loaderData.user?.address[0].location.region.name}
                  </span>
                </p>
              </label>
              <label className="space-y-2" htmlFor="pickupstation">
                <p>Pickup Station</p>
                <span className="text-base text-gray-600">
                  {loaderData.user?.address[0]?.pickup?.name as string}
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div>
            {loaderData.regions.length > 0 &&
              loaderData.regions[0].location.length > 0 && (
                <section className="flex w-full rounded-sm p-10 shadow-md">
                  <Form
                    method="post"
                    className="relative block w-full space-y-8"
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
                              loaderData.regions[Number(e.target.value)]
                                .location
                            );
                          }}
                        >
                          {loaderData.regions.map((region, index) => {
                            return (
                              <option key={region?.id} value={index}>
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
                              loaderData.regions[0].location[
                                Number(e.target.value)
                              ].address
                            );
                          }}
                        >
                          {location.map((location, index) => {
                            return (
                              <option key={location?.id} value={index}>
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
                    </fieldset>

                    <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
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
        )}
      </section>
      <section className="mt-5 ">
        <Form method="post" className="max-w-md">
          <fieldset>
            <input
              type="hidden"
              name="orderitems"
              value={JSON.stringify(cart)}
            />
            <input
              type="hidden"
              value={loaderData.user?.address[0]?.id}
              name="addressId"
            />
            <input type="hidden" name="total" value={total} />
          </fieldset>
          <fieldset>
            <button
              type="submit"
              name="placeorder"
              value="placeorder"
              className="w-full rounded-md bg-lime-500 p-3 text-center font-medium uppercase text-lime-50 shadow-md shadow-lime-200 hover:bg-lime-600 hover:text-white"
            >
              Confirm Order
            </button>
          </fieldset>
        </Form>
      </section>
    </div>
  );
}
