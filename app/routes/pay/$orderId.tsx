import { Form, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { useEffect } from "react";
import { CartState } from "~/context/Context";
import { MpesaAuth, mpesaExpress } from "~/models/mpesaapi.server";
import { getOrder } from "~/models/orders.server";

interface LoaderData {
  order: Awaited<ReturnType<typeof getOrder>>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const orderId = params.orderId as string;

  return json<LoaderData>(
    {
      order: await getOrder(orderId),
    },
    {
      status: 200,
    }
  );
};

interface ActionData {
  error: {
    mpesaError: any;
  };
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const phone = formData.get("phone") as string;
  const total = formData.get("total") as string;
  const newphone = "+254" + phone.substring(phone.length - 9);
  const orderId = params.orderId as string;
  return await MpesaAuth()
    .then(async (data: any) => {
      return await mpesaExpress(
        1,
        Number(newphone),
        data.access_token as string
      )
        .then((data: any) => {
          return redirect(`/pay/stkcallback?orderId=${orderId}`, {
            status: 200,
          });
        })
        .catch((err: any) => {
          return json<ActionData>({
            error: {
              mpesaError: err,
            },
          });
        });
    })

    .catch(async (err) => {
      return json<ActionData>(
        {
          error: {
            mpesaError: err,
          },
        },
        {
          status: 200,
        }
      );
    });
};

export default function Pay() {
  const loaderData = useLoaderData() as LoaderData;
  const { dispatch } = CartState();
  const actionData = useLoaderData() as ActionData;

  useEffect(() => {
    dispatch({ type: "CLEAR_CART" });
    console.log(actionData);
  }, [actionData]);
  return (
    <div>
      <Form method="post" className="space-y-3">
        <div>Amount: KSH {loaderData.order?.total}</div>
        <fieldset>
          <input type="hidden" name="total" value={loaderData.order?.total} />
        </fieldset>
        <fieldset>
          <label
            htmlFor="lipa na mpesa"
            className="flex items-center space-x-3"
          >
            <img src="/image.jpeg" alt="mpesa" className="w-16" />
            <span className="bg-gray-50 p-2 shadow-sm">+254</span>
            <input
              type="tel"
              autoFocus
              name="phone"
              placeholder="712456789"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg placeholder:text-gray-400 focus:border-lime-500 focus:outline-none focus:ring-0"
              required
            />

            <button className="bg-lime-500 px-10 py-2 text-lime-50 active:bg-lime-600">
              Pay
            </button>
          </label>
        </fieldset>
      </Form>
    </div>
  );
}
