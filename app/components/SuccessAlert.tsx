import React from "react";
import { IoClose } from "react-icons/io5";

export default function SuccessAlert({
  setSuccess,
  message,
}: {
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md">
      <div className="flex w-12 items-center justify-center bg-lime-500">
        <svg
          className="h-6 w-6 fill-current text-white"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
        </svg>
      </div>

      <div className="-mx-3 px-4 py-2">
        <div className="mx-3">
          <span className="font-semibold text-lime-500 ">Success</span>
          <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
        </div>
      </div>
      <div className="absolute right-0 flex h-full flex-col items-center justify-center p-3 shadow-sm">
        <button
          type="button"
          className="text-red-500"
          onClick={() => {
            setSuccess(false);
          }}
        >
          <IoClose className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
