import {
  unstable_parseMultipartFormData,
  UploadHandler,
} from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { ActionFunction, json, redirect } from "@remix-run/server-runtime";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Loader from "~/components/Loader";
import SuccessAlert from "~/components/SuccessAlert";
import { createFarmPotatoes } from "~/models/farm.server";
import { uploadStreamToCloudinary } from "~/models/fileuploads.server";
import { getFarmId } from "~/session.server";

interface ActionData {
  errors?: {
    variety?: string;
    quantity?: string;
    price?: string;
    image?: string;
    weight?: string;
    type?: string;
  };
  harverst?: Awaited<ReturnType<typeof createFarmPotatoes>>;
}

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler: UploadHandler = async ({ name, stream }) => {
    if (name !== "image") {
      stream.resume();
      return;
    }
    const uploadedImage = await uploadStreamToCloudinary(stream, {
      folder: "/home/project",
    });
    return uploadedImage.secure_url;
  };
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const variety = formData.get("variety");
  const quantity = formData.get("quantity");
  const weight = formData.get("weight");
  const price = formData.get("price");
  const image = formData.get("image");
  const discount = formData.get("discount");
  const type = formData.get("type");

  if (typeof variety !== "string") {
    json<ActionData>(
      {
        errors: {
          variety: "Variety is required",
        },
      },
      {
        status: 400,
      }
    );
  }
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
  if (typeof image !== "string") {
    json<ActionData>(
      {
        errors: {
          image: "Image is required",
        },
      },
      {
        status: 400,
      }
    );
  }

  if (typeof type !== "string") {
    json<ActionData>(
      {
        errors: {
          type: "Type is required",
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
  await createFarmPotatoes(
    farmId,
    variety as string,
    Number(quantity),
    Number(weight),
    Number(price),
    acruedDiscount,
    type as string,
    image as string
  );
  return redirect("/farm/inventory");
};
export default function add() {
  const formRef = useRef<HTMLFormElement>(null);
  const varietyRef = useRef<HTMLSelectElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const actionData = useActionData() as ActionData;
  const [success, setSuccess] = useState(false);
  const transition = useTransition();
  const loading = transition.state === "submitting";

  useEffect(() => {
    if (actionData?.errors?.variety) {
      varietyRef.current?.focus();
    } else if (actionData?.errors?.quantity) {
      quantityRef.current?.focus();
    } else if (actionData?.errors?.price) {
      priceRef.current?.focus();
    } else if (actionData?.errors?.weight) {
      weightRef.current?.focus();
    } else if (actionData?.errors?.image) {
      imageRef.current?.focus();
    } else if (actionData?.errors?.type) {
      typeRef.current?.focus();
    } else if (actionData?.harverst) {
      formRef.current?.reset();
      weightRef.current?.focus();
      setSuccess(true);
    }
  }, []);
  return (
    <div className="h-full w-full space-y-3">
      <div>Add Your Harvest</div>
      <div>
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
            <label
              className="flex w-full  flex-col-reverse space-y-2"
              htmlFor="variety"
            >
              <select
                name="variety"
                id="variety"
                className="peer"
                ref={varietyRef}
              >
                <option value="Irish">Irish</option>
                <option value="Asante">Asante</option>
                <option value="Shangi">Shangi</option>
                <option value="Sherekea">Sherekea</option>
                <option value="Taurus">Taurus</option>
                <option value="Markies">Markies</option>
                <option value="Unica">Unica</option>
              </select>
              <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                Variety
              </p>
            </label>
            <label className="w-full" htmlFor="weight">
              <div className="flex w-full  flex-col-reverse">
                <input
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0 focus:invalid:border-red-500"
                  type="number"
                  name="weight"
                  id="weight"
                  autoFocus={true}
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
          </fieldset>
          <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
            <label className="w-full" htmlFor="price">
              <div className="flex w-full  flex-col-reverse">
                <input
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0 focus:invalid:border-red-500"
                  type="number"
                  name="price"
                  id="price"
                  aria-invalid={!!actionData?.errors?.price}
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
            <label className="flex w-full  flex-col-reverse" htmlFor="discount">
              <input
                className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                type="number"
                name="discount"
                id="discount"
                aria-describedby="discount-error"
                ref={quantityRef}
                required
              />
              <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                Discount
              </p>
            </label>
          </fieldset>
          <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
            <label className=" w-full " htmlFor="quantity">
              <div className="flex w-full  flex-col-reverse">
                <input
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0 focus:invalid:border-red-500"
                  type="number"
                  name="quantity"
                  aria-invalid={!!actionData?.errors?.quantity}
                  aria-describedby="quantity-error"
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
            <label className=" w-full" htmlFor="image">
              <div className="flex w-full  flex-col-reverse space-y-2">
                <input
                  className="peer block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-lime-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-lime-700 hover:file:bg-lime-100"
                  type="file"
                  name="image"
                  id="image"
                  aria-invalid={!!actionData?.errors?.image}
                  aria-describedby="image-error"
                  ref={imageRef}
                  required
                />
                <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                  select your Harvest image
                </p>
              </div>
              {actionData?.errors?.image && (
                <div className="pt-1 text-red-700" id="image-error">
                  {actionData.errors.image}
                </div>
              )}
            </label>
          </fieldset>
          <fieldset>
            <label className="w-full" htmlFor="description">
              <div className="flex w-full  flex-col-reverse space-y-2">
                <select
                  defaultValue="Consumption"
                  aria-invalid={!!actionData?.errors?.type}
                  name="type"
                  id="type"
                  ref={typeRef}
                >
                  <option value="Consumption">Consumption</option>
                  <option value="SEEED">Seed</option>
                </select>
                <p className="text-sm text-gray-400 peer-focus:text-lime-500 invalid:peer-focus:text-red-500">
                  Type
                </p>
              </div>
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
              Add
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
