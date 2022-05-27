import { Form, useActionData, useTransition } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/node";
import { createFarmSession, getFarmId, requireFarm } from "~/session.server";
import { validateEmail } from "~/utils";
import { createFarm, getFarmByEmail } from "~/models/farm.server";
import React from "react";
import Loader from "~/components/Loader";

export const loader: LoaderFunction = async ({ request }) => {
  const farm = await getFarmId(request);
  if (farm) {
    return redirect("/farm");
  }
  return null;
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
    farmname?: string;
    confirmpassword?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmpassword = formData.get("confirmpassword");
  const farmname = formData.get("farmname");
  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }
  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }
  if (typeof farmname !== "string") {
    return json<ActionData>(
      { errors: { farmname: "Farmname is required" } },
      { status: 400 }
    );
  }

  if (typeof confirmpassword !== "string") {
    return json<ActionData>(
      { errors: { confirmpassword: "Confirmpassword is required" } },
      { status: 400 }
    );
  }
  if (password !== confirmpassword) {
    return json<ActionData>(
      {
        errors: {
          confirmpassword: "Password and confirmpassword must be same",
        },
      },
      { status: 400 }
    );
  }
  const existingFarm = await getFarmByEmail(email);
  if (existingFarm) {
    return json<ActionData>(
      { errors: { email: "Email is already registered" } },
      { status: 400 }
    );
  }
  const farm = await createFarm(email, farmname, password);
  return createFarmSession({
    request,
    farmId: farm.id,
    remember: false,
    redirectTo: "/registerfarm/ownerinfo",
  });
};

export default function index() {
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const transition = useTransition();
  const loading = transition.state === "submitting";
  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.confirmpassword) {
      phoneRef.current?.focus();
    } else if (actionData?.errors?.farmname) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);
  return (
    <div className="mt-10 block h-full w-full space-y-4">
      <div className="flex w-full flex-col items-center justify-center space-y-5">
        <h3 className="text-3xl">Step 1</h3>
        <p className="xl">Farm Info</p>
      </div>
      <div className="w-full">
        <Form
          className="relative w-full space-y-10 p-2"
          ref={formRef}
          method="post"
        >
          {loading && <Loader />}

          <fieldset className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <label className=" w-full space-y-3" htmlFor="farmname">
              <p>Farm Name</p>
              <input
                className="w-full focus:invalid:border-red-500 focus:invalid:ring-red-500"
                type="text"
                name="farmname"
                id="farmname"
                minLength={4}
                aria-invalid={!!actionData?.errors?.farmname}
                autoComplete="name"
                ref={nameRef}
                autoFocus
                aria-describedby="farmname-error"
                required
              />
              {actionData?.errors?.farmname && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.farmname}
                </div>
              )}
            </label>
            <label className="w-full space-y-3" htmlFor="email">
              <p>Email</p>
              <input
                className="w-full focus:invalid:border-red-500 focus:invalid:ring-red-500"
                type="email"
                name="email"
                id="email"
                ref={emailRef}
                aria-describedby="email-error"
                autoComplete="email"
                aria-invalid={!!actionData?.errors?.email}
                required
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </label>
          </fieldset>
          <fieldset className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <label className=" w-full space-y-3" htmlFor="password">
              <p>Password</p>
              <input
                className="w-full focus:invalid:border-red-500 focus:invalid:ring-red-500"
                type="password"
                name="password"
                id="password"
                autoComplete="off"
                ref={passwordRef}
                aria-describedby="password-error"
                aria-invalid={!!actionData?.errors?.password}
                required
              />
              {actionData?.errors?.password && (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </label>
            <label className="w-full space-y-3" htmlFor="confirmpassword">
              <p>Confirm Password</p>
              <input
                className="w-full focus:invalid:border-red-500 focus:invalid:ring-red-500"
                type="password"
                name="confirmpassword"
                id="confirmpassword"
                autoComplete="off"
                ref={phoneRef}
                aria-describedby="confirmpassword-error"
                aria-invalid={!!actionData?.errors?.confirmpassword}
                required
              />
              {actionData?.errors?.confirmpassword && (
                <div className="pt-1 text-red-700" id="confirmpassword-error">
                  {actionData.errors.confirmpassword}
                </div>
              )}
            </label>
          </fieldset>
          <fieldset className=" flex w-full flex-col items-center justify-center space-y-2">
            <button
              type="button"
              className="focus:outline-none focus:ring-0"
              onClick={() => {
                formRef.current?.reset();
                nameRef.current?.focus();
              }}
            >
              reset
            </button>
            <button
              type="submit"
              className="w-full bg-lime-500 py-3 px-6 text-center text-lime-50 transition duration-300 hover:scale-110 hover:bg-lime-600 lg:w-96"
            >
              Next
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
