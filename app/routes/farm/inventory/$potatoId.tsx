import {
  unstable_parseMultipartFormData,
  UploadHandler,
} from "@remix-run/node";
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
  redirect,
} from "@remix-run/server-runtime";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Loader from "~/components/Loader";
import SuccessAlert from "~/components/SuccessAlert";
import {
  createFarmPotatoes,
  getFarmPotatoById,
  updateFarmPotatoes,
} from "~/models/farm.server";
import { uploadStreamToCloudinary } from "~/models/fileuploads.server";
import { getFarmId } from "~/session.server";

interface LoaderData {
  potatoes: Awaited<ReturnType<typeof getFarmPotatoById>>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const potatoId = params.potatoId as string;
  return json<LoaderData>(
    {
      potatoes: await getFarmPotatoById(potatoId),
    },
    {
      status: 200,
    }
  );
};

interface ActionData {
  errors?: {
    variety?: string;
    quantity?: string;
    price?: string;
    image?: string;
    weight?: string;
    type?: string;
  };
  harverst?: Awaited<ReturnType<typeof updateFarmPotatoes>>;
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const quantity = formData.get("quantity");
  const weight = formData.get("weight");
  const price = formData.get("price");
  const discount = formData.get("discount");

  if (typeof quantity !== "string") {
    json<ActionData>(
      {
        errors: {
          quantity: "Quantity is required",
        },
      },
      {
        status: 400,
      }
    );
  }
  if (typeof price !== "string") {
    json<ActionData>(
      {
        errors: {
          price: "Price is required",
        },
      },
      {
        status: 400,
      }
    );
  }
  if (typeof weight !== "string") {
    json<ActionData>(
      {
        errors: {
          weight: "Weight is required",
        },
      },
      {
        status: 400,
      }
    );
  }
  if (Number(weight) > 50) {
    json<ActionData>(
      {
        errors: {
          weight: "Weight should be less than 50",
        },
      },
      {
        status: 400,
      }
    );
  }

  const acruedDiscount = typeof discount === "string" ? Number(discount) : 0;

  const farmId = await getFarmId(request);
  if (!farmId) {
    return redirect("/registerfarm");
  }
  const potatoId = params.potatoId as string;
  return json<ActionData>(
    {
      harverst: await updateFarmPotatoes(
        Number(quantity),
        Number(price),
        acruedDiscount,
        potatoId
      ),
    },
    {
      status: 200,
    }
  );
};
export default function add() {
  const formRef = useRef<HTMLFormElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const actionData = useActionData() as ActionData;
  const [success, setSuccess] = useState(false);
  const transition = useTransition();
  const loading = transition.state === "submitting";
  const loaderData = useLoaderData() as LoaderData;
  useEffect(() => {
    if (actionData?.errors?.quantity) {
      quantityRef.current?.focus();
    } else if (actionData?.errors?.price) {
      priceRef.current?.focus();
    } else if (actionData?.errors?.weight) {
      weightRef.current?.focus();
    } else if (actionData?.harverst) {
      formRef.current?.reset();
      weightRef.current?.focus();
      setSuccess(true);
    }
  }, []);
  return (
    <div className=" h-full w-full space-y-3">
      <div>Update Your Harvest</div>
      <div className=" flex max-h-64 w-full items-center justify-center">
        <img
          src={loaderData.potatoes?.imgUrl}
          alt={loaderData.potatoes?.variety}
          className="h-64"
        />
      </div>
      <div className="space-y-4 p-3">
        <Form
          className="relative block space-y-8"
          ref={formRef}
          method="post"
          encType="multipart/form-data"
        >
          {loading && <Loader />}
          {success && (
            <SuccessAlert
              message="Your Info was added Successfully!"
              setSuccess={setSuccess}
            />
          )}

          <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
            <label className="w-full" htmlFor="weight">
              <div className="flex w-full  flex-col-reverse">
                <input
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0 focus:invalid:border-red-500"
                  type="number"
                  name="weight"
                  id="weight"
                  autoFocus={true}
                  defaultValue={loaderData.potatoes?.unitWeight}
                  aria-invalid={!!actionData?.errors?.weight}
                  aria-describedby="weight-error"
                  max={50}
                  ref={weightRef}
                  required
                />

                <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                  Weight (Kgs) max(50) as per government regulations
                </p>
              </div>
              {actionData?.errors?.weight && (
                <div className="pt-1 text-red-700" id="weight-error">
                  {actionData.errors.weight}
                </div>
              )}
            </label>
            <label className="w-full" htmlFor="price">
              <div className="flex w-full  flex-col-reverse">
                <input
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0 focus:invalid:border-red-500"
                  type="number"
                  name="price"
                  id="price"
                  aria-invalid={!!actionData?.errors?.price}
                  defaultValue={loaderData.potatoes?.price}
                  aria-describedby="price-error"
                  ref={priceRef}
                  required
                />
                <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                  Price
                </p>
              </div>

              {actionData?.errors?.price && (
                <div className="pt-1 text-red-700" id="price-error">
                  {actionData.errors.price}
                </div>
              )}
            </label>
          </fieldset>
          <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
            <label className="flex w-full  flex-col-reverse" htmlFor="discount">
              <input
                className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                type="number"
                name="discount"
                id="discount"
                defaultValue={loaderData.potatoes?.discount}
                aria-describedby="discount-error"
                ref={quantityRef}
                required
              />
              <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                Discount
              </p>
            </label>
            <label className=" w-full " htmlFor="quantity">
              <div className="flex w-full  flex-col-reverse">
                <input
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0 focus:invalid:border-red-500"
                  type="number"
                  name="quantity"
                  aria-invalid={!!actionData?.errors?.quantity}
                  aria-describedby="quantity-error"
                  defaultValue={loaderData.potatoes?.quantity}
                  id="quantity"
                  ref={quantityRef}
                  required
                />
                <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                  Quantity Available
                </p>
              </div>
              {actionData?.errors?.quantity && (
                <div className="pt-1 text-red-700" id="quantity-error">
                  {actionData.errors.quantity}
                </div>
              )}
            </label>
          </fieldset>

          <fieldset className="flex w-full flex-col items-center space-y-5 p-2 ">
            <button
              type="button"
              onClick={() => {
                formRef.current?.reset();
              }}
            >
              reset form
            </button>
            <button
              type="submit"
              className="w-full rounded-md bg-lime-500 p-3 text-center font-medium uppercase text-lime-50 shadow-md shadow-lime-200 hover:bg-lime-600 hover:text-white lg:max-w-md"
            >
              update
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
