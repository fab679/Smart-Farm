import {
  unstable_parseMultipartFormData,
  UploadHandler,
} from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import React from "react";
import Loader from "~/components/Loader";
import { uploadStreamToCloudinary } from "~/models/fileuploads.server";
import { createOwner, getOwnerByPhone } from "~/models/owner.server";
import { getFarmId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const farm = await getFarmId(request);
  if (!farm) {
    return redirect("/registerfarm");
  }
  return null;
};
interface ActionData {
  errors: {
    firstname?: string;
    lastname?: string;
    phone?: string;
    idnumber?: string;
    idImgUrlfront?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler: UploadHandler = async ({ name, stream }) => {
    if (name !== "idImgUrlfront") {
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
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const phone = formData.get("phone");
  const idnumber = formData.get("idnumber");
  const idImgUrlfront = formData.get("idImgUrlfront");

  if (typeof firstname !== "string") {
    return json<ActionData>(
      { errors: { firstname: "Firstname is required" } },
      { status: 400 }
    );
  }
  if (typeof lastname !== "string") {
    return json<ActionData>(
      { errors: { lastname: "Lastname is required" } },
      { status: 400 }
    );
  }
  if (typeof phone !== "string") {
    return json<ActionData>(
      { errors: { phone: "Phone is required" } },
      { status: 400 }
    );
  }
  if (typeof idnumber !== "string") {
    return json<ActionData>(
      { errors: { idnumber: "Idnumber is required" } },
      { status: 400 }
    );
  }
  if (typeof idImgUrlfront !== "string") {
    return json<ActionData>(
      { errors: { idImgUrlfront: "idImgUrlfront is required" } },
      { status: 400 }
    );
  }

  const ownerphoneExist = await getOwnerByPhone(phone);
  if (ownerphoneExist) {
    return json<ActionData>(
      { errors: { phone: "Phone is already registered" } },
      { status: 400 }
    );
  }
  const farm = (await getFarmId(request)) as string;
  await createOwner(firstname, lastname, phone, idnumber, idImgUrlfront, farm);
  return redirect("/registerfarm/address");
};
export default function ownerinfo() {
  const actionData = useActionData() as ActionData;
  const formRef = React.useRef<HTMLFormElement>(null);
  const firstnameRef = React.useRef<HTMLInputElement>(null);
  const lastnameRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const idnumberRef = React.useRef<HTMLInputElement>(null);
  const idImgUrlfrontRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string>("");
  const transition = useTransition();
  const loading = transition.state === "submitting";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };
  React.useEffect(() => {
    if (actionData?.errors?.firstname) {
      firstnameRef.current?.focus();
    } else if (actionData?.errors?.lastname) {
      lastnameRef.current?.focus();
    } else if (actionData?.errors?.phone) {
      phoneRef.current?.focus();
    } else if (actionData?.errors?.idnumber) {
      idnumberRef.current?.focus();
    } else if (actionData?.errors?.idImgUrlfront) {
      idImgUrlfrontRef.current?.focus();
    }
  }, [actionData]);
  return (
    <div className="mt-10 block h-full w-full space-y-4">
      <div className="flex w-full flex-col items-center justify-center space-y-5">
        <h3 className="text-3xl">Step 2</h3>
        <p className="xl">Farm Owner Info</p>
      </div>
      <div>
        <Form
          className="relative w-full space-y-10 p-2"
          method="post"
          ref={formRef}
          encType="multipart/form-data"
        >
          {loading && <Loader />}
          <fieldset className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <label className=" w-full space-y-3" htmlFor="firstname">
              <p>First Name</p>
              <input
                className="w-full focus:invalid:border-red-500 focus:invalid:ring-red-500"
                type="text"
                name="firstname"
                id="firstname"
                ref={firstnameRef}
                autoComplete="firstname"
                aria-invalid={actionData?.errors?.firstname ? true : undefined}
                aria-describedby="firstname-error"
                autoFocus
                minLength={4}
                required
              />
              {actionData?.errors?.firstname && (
                <div className="pt-1 text-red-700" id="firstname-error">
                  {actionData.errors.firstname}
                </div>
              )}
            </label>
            <label className="w-full space-y-3" htmlFor="lastname">
              <p>Last Name</p>
              <input
                className="w-full focus:invalid:border-red-500 focus:invalid:ring-red-500"
                type="text"
                name="lastname"
                id="lastname"
                minLength={4}
                ref={lastnameRef}
                autoComplete="lastname"
                aria-invalid={actionData?.errors?.lastname ? true : undefined}
                aria-describedby="lastname-error"
                required
              />
              {actionData?.errors?.lastname && (
                <div className="pt-1 text-red-700" id="lastname-error">
                  {actionData.errors.lastname}
                </div>
              )}
            </label>
          </fieldset>
          <fieldset className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <label className=" w-full space-y-3" htmlFor="phone">
              <p>Phone</p>
              <div className="flex items-center space-x-4 ">
                <label htmlFor="prefix" className="space-y-2">
                  <p className="border bg-gray-50 px-4 py-2">+254</p>
                </label>
                <input
                  className="w-full focus:invalid:border-red-500 focus:invalid:ring-red-500 "
                  type="tel"
                  name="phone"
                  id="phone"
                  ref={phoneRef}
                  autoComplete="phone"
                  aria-invalid={actionData?.errors?.phone ? true : undefined}
                  aria-describedby="phone-error"
                  required
                />
              </div>
              {actionData?.errors?.phone && (
                <div className="pt-1 text-red-700" id="phone-error">
                  {actionData.errors.phone}
                </div>
              )}
            </label>
            <label className="w-full space-y-3" htmlFor="idnumber">
              <p>ID Number</p>
              <input
                className="w-full focus:invalid:border-red-500 focus:invalid:ring-red-500"
                type="number"
                name="idnumber"
                id="idnumber"
                ref={idnumberRef}
                autoComplete="idnumber"
                aria-invalid={actionData?.errors?.idnumber ? true : undefined}
                aria-describedby="idnumber-error"
                required
              />
              {actionData?.errors?.idnumber && (
                <div className="pt-1 text-red-700" id="idnumber-error">
                  {actionData.errors.idnumber}
                </div>
              )}
            </label>
          </fieldset>
          <fieldset className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <label className=" w-full space-y-3" htmlFor="idImgUrlfront">
              <p>ID Photo</p>
              <input
                className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-lime-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-lime-700 hover:file:bg-violet-100 focus:outline-none focus:ring-0"
                type="file"
                name="idImgUrlfront"
                id="idImgUrlfront"
                ref={idImgUrlfrontRef}
                autoComplete="idImgUrlfront"
                aria-invalid={
                  actionData?.errors?.idImgUrlfront ? true : undefined
                }
                aria-describedby="idImgUrlfront-error"
                accept="image/*"
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              />
            </label>
          </fieldset>
          <fieldset className="w-full">
            {preview && <img src={preview} alt="preview" className="h-28" />}
          </fieldset>
          <fieldset className=" flex w-full flex-col items-center justify-center space-y-2 ">
            <button
              type="button"
              className="focus:outline-none focus:ring-0"
              onClick={() => {
                formRef.current?.reset();
                firstnameRef.current?.focus();
              }}
            >
              reset
            </button>
            <button className="w-full bg-lime-500 py-3 px-6 text-center text-lime-50 transition duration-300 hover:scale-110 hover:bg-lime-600 lg:w-96">
              Next
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
