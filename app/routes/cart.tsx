import { Form, Link } from "@remix-run/react";
import { MetaFunction } from "@remix-run/server-runtime";
import { useEffect, useState } from "react";
import BottomNav from "~/components/BottomNav";
import CommandPalette from "~/components/CommandPalette";
import MainNav from "~/components/MainNav";
import { GrFormSubtract, GrFormAdd } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { CartState } from "~/context/Context";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Basket - Smart Farm",
  viewport: "width=device-width,initial-scale=1",
});

export default function shop() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    state: { cart },
    dispatch,
  } = CartState();
  const [total, setTotal] = useState<number>();
  useEffect(() => {
    setTotal(
      cart.reduce(
        (acc, curr: any) => acc + Number(curr?.price) * Number(curr?.qty),
        0
      )
    );
  }, [cart]);
  return (
    <div className="relative min-h-full bg-zinc-50 pb-10">
      <CommandPalette isOpen={isOpen} setIsOpen={setIsOpen} />
      <MainNav setIsOpen={setIsOpen} />
      <div className="flex w-full items-center justify-center py-6">
        <h3 className="text-3xl text-gray-800">Basket</h3>
      </div>
      {cart.length > 0 ? (
        <div className="flex h-full w-full flex-col space-y-6 bg-white px-10 py-10 lg:flex-row lg:justify-between lg:space-y-0 ">
          <div className="flex flex-col space-y-5 divide-y px-4 lg:hidden">
            {/* Mobile Devices */}
            {cart.map((item: any) => {
              return (
                <div className="flex flex-col ">
                  <div className="flex justify-between py-3 px-1 text-base">
                    <h3 className="font-semibold text-gray-800 ">Product:</h3>{" "}
                    <p className="text-gray-800">{item?.variety}</p>
                  </div>
                  <div className="flex justify-between py-3 px-1">
                    <h3 className=" text-lime-600 ">Price:</h3>{" "}
                    <p className="font-light text-lime-600">
                      KSH {item?.price}
                    </p>
                  </div>
                  <div className="flex justify-between py-3 px-1">
                    <h3 className="font-semibold ">Quantity:</h3>{" "}
                    <div className="flex items-center space-x-4 border px-3 py-2 text-base">
                      <button
                        onClick={() => {
                          dispatch({
                            type: "CHANGE_QUANTITY",
                            payload: {
                              id: item?.id,
                              qty: item?.qty - 1,
                            },
                          });
                        }}
                      >
                        <GrFormSubtract />
                      </button>
                      <span className="text-gray-400">{item?.qty}</span>
                      <button
                        onClick={() => {
                          dispatch({
                            type: "CHANGE_QUANTITY",
                            payload: {
                              id: item?.id,
                              qty: item?.qty + 1,
                            },
                          });
                        }}
                      >
                        <GrFormAdd />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between py-3 px-1">
                    <h3 className=" text-lime-600 ">Total:</h3>{" "}
                    <p className="font-light text-lime-600">
                      KSH {item?.qty * item?.price}
                    </p>
                  </div>
                  <div className="w-full  bg-zinc-100  px-1 text-gray-900 shadow-md hover:text-red-600">
                    <button
                      className="flex w-full items-center justify-center py-5 text-center"
                      onClick={() => {
                        dispatch({
                          type: "REMOVE_FROM_CART",
                          payload: {
                            id: item?.id,
                          },
                        });
                      }}
                    >
                      {" "}
                      <IoMdClose />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="flex space-x-3">
              {/* Update cart Button */}
              <button className=" w-full bg-red-400 py-3 text-center text-white shadow-md shadow-red-200">
                {" "}
                Clear Cart
              </button>
              <button className=" w-full bg-lime-400 py-3 text-center text-white shadow-md shadow-lime-200">
                {" "}
                Continue Shopping
              </button>
            </div>
          </div>
          <div className="hidden lg:flex">
            <table className="w-full max-w-6xl table-fixed">
              <thead>
                <tr className="text-base font-medium uppercase text-gray-900">
                  <th></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y ">
                {cart.map((item: any, index) => (
                  <tr className="shadow-sm" key={index}>
                    <td>
                      <img src={item?.imgUrl} alt="potato" className="h-16" />
                    </td>
                    <td className="text-center">{item?.variety}</td>
                    <td className="px-2 text-center text-lime-600">
                      KSH {item?.price}
                    </td>
                    <td>
                      <div className="flex items-center justify-center space-x-4 border px-3 py-2 text-base">
                        <button
                          className="flex w-full items-center justify-center"
                          onClick={() => {
                            dispatch({
                              type: "CHANGE_QUANTITY",
                              payload: {
                                id: item?.id,
                                qty: item?.qty - 1,
                              },
                            });
                          }}
                        >
                          <GrFormSubtract />
                        </button>
                        <span className="text-gray-400">{item?.qty}</span>
                        <button
                          className="flex w-full items-center justify-center"
                          onClick={() => {
                            dispatch({
                              type: "CHANGE_QUANTITY",
                              payload: {
                                id: item?.id,
                                qty: item?.qty + 1,
                              },
                            });
                          }}
                        >
                          <GrFormAdd />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 text-center text-lime-600">
                      KSH {item?.price * item?.qty}
                    </td>
                    <td>
                      <button
                        className="flex w-full items-center justify-center hover:text-red-600"
                        onClick={() => {
                          dispatch({
                            type: "REMOVE_FROM_CART",
                            payload: {
                              id: item?.id,
                            },
                          });
                        }}
                      >
                        <IoMdClose />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full max-w-md space-y-2 rounded-lg bg-gray-50 px-3 py-3 shadow-md">
            {/*  Cart Totals */}
            <div className="flex items-center justify-center">
              <h5 className="font-semibold text-gray-800">Cart totals</h5>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="subtotal" className="text-gray-700">
                Subtotal
              </label>
              <p>KSH {total} </p>
            </div>
            <div className="flex w-full items-center justify-between bg-gray-200 py-5 px-1">
              <label htmlFor="total" className="text-gray-700">
                Total
              </label>
              <p className="text-xl font-bold text-gray-900">KSH {total}</p>
            </div>
            <div className="flex flex-col justify-center space-y-3">
              <Link
                to={`/checkout?redirectTo=checkout`}
                className="w-full rounded-md bg-lime-500 p-3 text-center text-white transition duration-300 hover:bg-lime-600"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={() => {
                  dispatch({
                    type: "CLEAR_CART",
                  });
                }}
                className="w-full rounded-md bg-red-500 p-3 text-center text-white transition duration-300 hover:bg-red-600"
              >
                Clear Cart
              </button>
              <Link
                to="/shop"
                className="flex w-full items-center justify-center text-center text-gray-400"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg">
          No items in cart yet{" "}
          <Link to="/shop" className="text-lime-500">
            Shop now
          </Link>
        </p>
      )}
      <BottomNav />
    </div>
  );
}
