import { Link } from "@remix-run/react";
import { HiOutlineViewGrid } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { BsCart4, BsHeart } from "react-icons/bs";
import { CartState } from "~/context/Context";
export default function BottomNav() {
  const {
    state: { cart },
  } = CartState();
  return (
    <div className="fixed bottom-0 z-20 flex w-full items-center justify-between bg-gray-50 px-10 py-6  text-2xl shadow-md  lg:hidden">
      {/* Mobile Footer Nav */}
      <Link to="/shop" className="hover:text-lime-500">
        <HiOutlineViewGrid />
      </Link>
      <Link to="/account" className="hover:text-lime-500">
        <AiOutlineUser />
      </Link>
      <Link to="/cart" className="relative">
        <BsCart4 className=" text-lime-600" />
        <span className=" absolute -top-3 -right-4  text-lime-500">
          {cart.length}
        </span>
      </Link>
      <Link to="." className="hover:text-lime-500">
        <BsHeart />
      </Link>
    </div>
  );
}
