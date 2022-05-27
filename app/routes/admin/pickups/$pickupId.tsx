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
import { useEffect, useRef } from "react";
import Loader from "~/components/Loader";
import {
  getPickUpById,
  updatepickupstationPassword,
} from "~/models/pickupstation.server";

interface LoaderData {
  pickupstation: Awaited<ReturnType<typeof getPickUpById>>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const pickupId = params.pickupId as string;
  return json<LoaderData>(
    {
      pickupstation: await getPickUpById(pickupId),
    },
    { status: 200 }
  );
};

interface ActionData {
  error?: {
    pickupsttationname?: string;
    pickupstationepassword?: string;
  };
  pickupstation?: Awaited<ReturnType<typeof updatepickupstationPassword>>;
}

export const action: ActionFunction = async ({ request, params }) => {
  const pickupId = params.pickupId as string;
  const formData = await request.formData();
  const pickupstationname = formData.get("pickupstationname");
  const pickupstationpassword = formData.get("pickupstationpassword");
  if (typeof pickupstationname !== "string") {
    return json<ActionData>(
      {
        error: {
          pickupsttationname: "Pickup Station Name is required",
        },
      },
      { status: 400 }
    );
  }
  if (typeof pickupstationpassword !== "string") {
    return json<ActionData>(
      {
        error: {
          pickupstationepassword: "Pickup Station Password is required",
        },
      },
      { status: 400 }
    );
  }
  if (pickupstationpassword.length < 6) {
    return json<ActionData>(
      {
        error: {
          pickupstationepassword:
            "Pickup Station Password must be at least 6 characters",
        },
      },
      { status: 400 }
    );
  }
  return json<ActionData>(
    {
      pickupstation: await updatepickupstationPassword(
        pickupId,
        pickupstationname,
        pickupstationpassword
      ),
    },
    { status: 200 }
  );
};

export default function index() {
  const loaderData = useLoaderData() as LoaderData;
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData() as ActionData;
  console.log(actionData);
  const transition = useTransition();
  const formTransition = transition.state === "loading";
  useEffect(() => {
    if (actionData?.error?.pickupsttationname) {
      nameRef.current?.focus();
    }
    if (actionData?.error?.pickupstationepassword) {
      passwordRef.current?.focus();
    }

    if (actionData?.pickupstation) {
      formRef.current?.reset();
    }
  }, [actionData]);
  return (
    <div className="container mx-auto p-2 ">
      <Form className="relative w-full space-y-4" ref={formRef} method="post">
        {formTransition && <Loader />}
        <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
          <label
            htmlFor="pickupstationname"
            className="flex w-full  flex-col-reverse"
          >
            <input
              type="text"
              ref={nameRef}
              name="pickupstationname"
              className="peer w-full border-0 border-b text-lg capitalize text-gray-700 placeholder:text-gray-300 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
              defaultValue={loaderData.pickupstation?.name}
              autoFocus
              required
            />
            <p className="text-sm text-gray-400 peer-focus:text-lime-500">
              Pickupstation Name
            </p>
          </label>
          <div className="flex w-full flex-col space-y-2">
            <label
              htmlFor="pickupstationpassword"
              className="flex w-full  flex-col-reverse"
            >
              <input
                type="password"
                name="pickupstationpassword"
                className="peer w-full border-0 border-b text-lg capitalize text-gray-700 placeholder:text-gray-300 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                ref={passwordRef}
                aria-invalid={
                  actionData?.error?.pickupstationepassword ? true : undefined
                }
                aria-describedby="password-error"
                required
              />
              <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                Pickupstation Password
              </p>
            </label>
            {actionData?.error?.pickupstationepassword && (
              <p className="text-sm text-red-500" id="password-error">
                {actionData.error.pickupstationepassword}
              </p>
            )}
          </div>
        </fieldset>
        <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
          <button
            type="submit"
            className="w-full rounded-md bg-lime-500 p-3 text-center font-medium uppercase text-lime-50 shadow-md shadow-lime-200 hover:bg-lime-600 hover:text-white"
          >
            update
          </button>
        </fieldset>
      </Form>
    </div>
  );
}
