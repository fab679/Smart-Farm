import { Menu, Transition } from "@headlessui/react";
import { Fragment, SetStateAction } from "react";
import { Link, useOutletContext } from "@remix-run/react";
import { BsCart4, BsHeart } from "react-icons/bs";
import { HiOutlineMenu } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { ContextLoaderData } from "~/root";
import { CartState } from "~/context/Context";
export default function MainNav({
  setIsOpen,
}: {
  setIsOpen: SetStateAction<any>;
}) {
  const contextData = useOutletContext<ContextLoaderData>();
  const {
    state: { cart },
  } = CartState();
  return (
    <nav className="text- sticky inset-0 top-0 z-30 bg-white">
      <div className=" flex w-full items-center justify-between p-2 py-3 lg:hidden">
        {/* Mobile Devices */}
        <div>
          <Link to="/cart" className="relative">
            <BsCart4 className="text-3xl text-lime-600" />
            <span className=" absolute -top-3 -right-9  text-lime-500">
              {cart.length}
            </span>
          </Link>
        </div>
        <div>
          <Link to="/" className="text-4xl">
            <span className="font-semibold text-lime-600">Smart</span>
            <span className="text-gray-800">Farm</span>
          </Link>
        </div>
        <div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button>
                <HiOutlineMenu className="text-3xl text-gray-700" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-3  w-72 origin-top-right divide-y divide-gray-600 rounded-md bg-gray-700 text-gray-50 shadow-lg ring-1 ring-black/5 focus:outline-none ">
                <div className="p-1 py-6">
                  <Menu.Item>
                    <div className="flex w-full items-center justify-center  ">
                      <Link
                        to="/account"
                        className="mx-5 text-2xl text-gray-300 hover:font-medium hover:text-white"
                      >
                        <AiOutlineUser />
                      </Link>
                      <Link
                        to="."
                        className="mx-5 text-xl text-gray-300 hover:font-medium hover:text-white"
                      >
                        <BsHeart />
                      </Link>
                      <button
                        onClick={() => setIsOpen(true)}
                        className="mx-5 text-2xl text-gray-300 hover:font-medium hover:text-white"
                      >
                        <BiSearch />
                      </button>
                    </div>
                  </Menu.Item>
                </div>
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="."
                        className={`${
                          active
                            ? "text-gray-white font-medium"
                            : "text-gray-300"
                        } group flex w-full items-center rounded-md p-2 text-base font-semibold`}
                      >
                        Home
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/shop"
                        className={`${
                          active
                            ? "text-gray-white font-medium"
                            : "text-gray-300"
                        } group flex w-full items-center rounded-md p-2 text-base font-semibold`}
                      >
                        Shop
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="."
                        className={`${
                          active
                            ? "text-gray-white font-medium"
                            : "text-gray-300"
                        } group flex w-full items-center rounded-md p-2 text-base font-semibold`}
                      >
                        About
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="."
                        className={`${
                          active
                            ? "text-gray-white font-medium"
                            : "text-gray-300"
                        } group flex w-full items-center rounded-md p-2 text-base font-semibold`}
                      >
                        Contact
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="."
                        className={`${
                          active
                            ? "text-gray-white font-medium"
                            : "text-gray-300"
                        } group flex w-full items-center rounded-md p-2 text-base font-semibold`}
                      >
                        Terms of use
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <div className="container mx-auto hidden flex-col  py-4 text-base font-medium lg:flex">
        {/* Desktop Devices */}
        <div className="sticky top-0 z-20 flex w-full items-center justify-between py-2">
          {/* Top bar */}
          <div>
            <Link to="/" className="text-4xl">
              <span className="font-semibold text-lime-600">Smart</span>
              <span className="text-gray-800">Farm</span>
            </Link>
          </div>
          <div className="w-full px-10">
            <button
              className="flex w-full border bg-gray-50 px-3 py-2"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <BiSearch className="mr-2 h-6 w-6 text-gray-700 " />
              <span>Quick Search ....</span>
            </button>
          </div>
          <div>
            <div className="flex items-center justify-center  ">
              {contextData.user ? (
                <div className="flex items-center justify-center  ">
                  <Link
                    to="/account"
                    className="mr-5 text-2xl text-gray-500 hover:font-medium hover:text-gray-700"
                  >
                    <AiOutlineUser />
                  </Link>
                  <Link
                    to="."
                    className="mx-5 text-xl text-gray-500 hover:font-medium hover:text-gray-700"
                  >
                    <BsHeart />
                  </Link>
                </div>
              ) : (
                <Link
                  to={"/login"}
                  className="flex items-center justify-center  "
                >
                  Login
                </Link>
              )}

              <Link to="/cart" className="relative">
                <BsCart4 className="ml-5 text-2xl text-lime-600 hover:font-medium hover:text-lime-400" />
                <span className=" absolute -top-3 -right-2 text-lime-500">
                  {cart.length}
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between py-2">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-lg  transition duration-300 hover:text-lime-500"
            >
              {" "}
              Home
            </Link>
            <Link
              to="/shop"
              className="mx-3 text-lg transition duration-300 hover:text-lime-500"
            >
              {" "}
              Shop
            </Link>
          </div>
          <div className="flex items-center">
            {contextData.user ? null : (
              <Link
                to="/loginfarm"
                className="mx-3 text-lg transition duration-300 hover:text-lime-500"
              >
                {" "}
                Register/Login Farm
              </Link>
            )}
            <Link
              to="/"
              className="mx-3 text-lg transition duration-300 hover:text-lime-500"
            >
              {" "}
              About
            </Link>
            <Link
              to="/"
              className="mx-3 text-lg transition duration-300 hover:text-lime-500"
            >
              {" "}
              Contact
            </Link>
            <Link
              to="/"
              className="text-lg  transition duration-300 hover:text-lime-500"
            >
              {" "}
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
