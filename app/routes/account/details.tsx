import { MetaFunction } from "@remix-run/react/routeModules";
import { Form } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { GrFormView } from "react-icons/gr";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Settings - Smart Farm",
  viewport: "width=device-width,initial-scale=1",
});

export default function details() {
  const [currentpassword, setCurrentPassword] = useState<boolean>(false);
  const [newpassword, setNewPassword] = useState<boolean>(false);
  const [confirmpassword, setConfirmPassword] = useState<boolean>(false);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const retypeNewPasswordRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (
      currentpassword === true &&
      currentPasswordRef.current?.type === "password"
    ) {
      currentPasswordRef.current.focus();
      currentPasswordRef.current.type = "text";
    } else if (
      currentpassword === false &&
      currentPasswordRef.current?.type === "text"
    ) {
      currentPasswordRef.current.focus();
      currentPasswordRef.current.type = "password";
    }
    if (newpassword === true && newPasswordRef.current?.type === "password") {
      newPasswordRef.current.focus();
      newPasswordRef.current.type = "text";
    } else if (
      newpassword === false &&
      newPasswordRef.current?.type === "text"
    ) {
      newPasswordRef.current.focus();
      newPasswordRef.current.type = "password";
    }
    if (
      confirmpassword === true &&
      retypeNewPasswordRef.current?.type === "password"
    ) {
      retypeNewPasswordRef.current.focus();
      retypeNewPasswordRef.current.type = "text";
    } else if (
      confirmpassword === false &&
      retypeNewPasswordRef.current?.type === "text"
    ) {
      retypeNewPasswordRef.current.focus();
      retypeNewPasswordRef.current.type = "password";
    }
  }, [currentpassword, newpassword, confirmpassword]);

  return (
    <div className="h-full w-full space-y-1 divide-y rounded-md  bg-white pb-10 shadow-md">
      <div className="flex w-full justify-center p-3 lg:justify-start">
        <h2 className="text-2xl font-medium text-gray-800 ">Settings</h2>
      </div>
      <div className="w-full space-y-12 p-2">
        <section className="block w-full space-y-4" id="personalinfo">
          <div>
            <h3 className="text-xl font-medium text-gray-600">
              Personal Info:
            </h3>
          </div>
          <Form className="block space-y-8">
            <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
              <label
                htmlFor="first name"
                className="flex w-full  flex-col-reverse"
              >
                <input
                  type="text"
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                  defaultValue="fabisch"
                  required
                />
                <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                  First Name
                </p>
              </label>
              <label
                htmlFor="last name"
                className="flex w-full  flex-col-reverse "
              >
                <input
                  type="text"
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                  defaultValue="kamau"
                  required
                />

                <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                  Last Name
                </p>
              </label>
            </fieldset>
            <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
              <label htmlFor="Email" className="flex w-full  flex-col-reverse">
                <h5 className="text-lg text-gray-700">
                  kamaufabisch1175@gmail.com
                </h5>
                <p className="text-sm text-gray-400 ">Email</p>
              </label>
              <div className="flex w-full  space-x-4">
                <label htmlFor="prefix">
                  <p className=" text-sm text-gray-400 ">Prefix</p>
                  <h5 className="mt-2.5 text-lg text-gray-700">+254</h5>
                </label>
                <label
                  htmlFor="phone number"
                  className="flex w-full  flex-col-reverse"
                >
                  <input
                    type="tel"
                    className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                    defaultValue={702417802}
                    required
                  />
                  <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                    Phone Number (optional)
                  </p>
                </label>
              </div>
            </fieldset>

            <fieldset className="block w-full space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
              <label htmlFor="gender" className="flex w-full  flex-col-reverse">
                <select
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                  defaultValue="undefined"
                >
                  <option value="undefined">Please Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                  Gender (optional)
                </p>
              </label>
              <label
                htmlFor="date"
                className="relative flex  w-full flex-col-reverse"
              >
                <input
                  type="date"
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                />

                <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                  Date of Birth (optional)
                </p>
              </label>
            </fieldset>
            <fieldset className="w-full p-2">
              <button
                type="button"
                className="w-full rounded-md bg-lime-500 p-3 text-center font-medium uppercase text-lime-50 shadow-md shadow-lime-200 hover:bg-lime-600 hover:text-white"
              >
                save
              </button>
            </fieldset>
          </Form>
        </section>
        <section className="block w-full space-y-4" id="changepassword">
          <div>
            <h3 className="text-xl font-medium text-gray-600">
              Change Password:
            </h3>
          </div>
          <Form className="block space-y-8">
            <fieldset className="block space-y-4">
              <label
                htmlFor="current password"
                className="relative flex  w-full flex-col-reverse  lg:max-w-md"
              >
                <input
                  type="password"
                  ref={currentPasswordRef}
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                  required
                />
                <button
                  className="absolute right-2 bottom-2 z-10 "
                  type="button"
                  onClick={() => setCurrentPassword(!currentpassword)}
                >
                  <GrFormView className="h-8 w-8" />
                </button>
                <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                  Curent Password
                </p>
              </label>
              <label
                htmlFor="new password"
                className="relative flex  w-full flex-col-reverse  lg:max-w-md"
              >
                <input
                  type="password"
                  ref={newPasswordRef}
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                  required
                />
                <button
                  className="absolute right-2 bottom-2 z-10 "
                  type="button"
                  onClick={() => setNewPassword(!newpassword)}
                >
                  <GrFormView className="h-8 w-8" />
                </button>
                <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                  New Password
                </p>
              </label>
              <label
                htmlFor="retype new password"
                className="relative flex  w-full flex-col-reverse  lg:max-w-md"
              >
                <input
                  type="password"
                  ref={retypeNewPasswordRef}
                  className="peer w-full border-0 border-b text-lg capitalize text-gray-700 focus:border-b-2 focus:border-b-lime-500 focus:no-underline focus:outline-none focus:ring-0"
                  required
                />
                <button
                  className="absolute right-2 bottom-2 z-10 "
                  type="button"
                  onClick={() => setConfirmPassword(!confirmpassword)}
                >
                  <GrFormView className="h-8 w-8" />
                </button>
                <p className="text-sm text-gray-400 peer-focus:text-lime-500">
                  Retype New Password
                </p>
              </label>
            </fieldset>
            <fieldset className="w-full p-2">
              <button
                type="button"
                className="w-full rounded-md bg-lime-500 p-3 text-center font-medium uppercase text-lime-50 shadow-md shadow-lime-200 hover:bg-lime-600 hover:text-white lg:max-w-md"
              >
                save
              </button>
            </fieldset>
          </Form>
        </section>
      </div>
    </div>
  );
}
