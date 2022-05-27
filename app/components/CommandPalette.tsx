import { Dialog, Combobox, Transition } from "@headlessui/react";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";

const project = [
  {
    id: 1,
    title: "Project 1",
  },
  {
    id: 2,
    title: "Project 2",
  },
  {
    id: 3,
    title: "Project 3",
  },
  {
    id: 4,
    title: "Project 4",
  },
];

export default function CommandPalette({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: SetStateAction<any>;
}) {
  const [query, setQuery] = useState<string>("");
  const filteredProjects = query
    ? project.filter((proj) =>
        proj.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      )
    : [];
  console.log(query);
  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        setIsOpen(!isOpen);
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [isOpen]);
  return (
    <Transition.Root
      show={isOpen}
      as={Fragment}
      afterLeave={() => {
        setQuery("");
      }}
    >
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
      >
        <Transition.Child
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500/75" />
        </Transition.Child>
        <Transition.Child
          enter="duration-300 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Combobox
            onChange={(value: string) => {
              console.log(value);
            }}
            as="div"
            value=""
            className=" relative mx-auto max-w-xl overflow-hidden rounded-xl bg-white text-sm shadow-2xl ring-1 ring-black/5"
          >
            <div className="flex items-center px-4">
              <BiSearch className="h-6 w-6 text-gray-500" />
              <Combobox.Input
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                placeholder="variety, location, farm ....."
                className="h-12 w-full border-0 bg-transparent text-gray-800 placeholder:text-gray-400 focus:border-0 focus:ring-0"
              />
            </div>
            {filteredProjects.length > 0 && (
              <>
                {" "}
                <Combobox.Options
                  className="max-h-96 overflow-y-auto py-4 text-sm"
                  static
                >
                  {filteredProjects.map((value) => {
                    return (
                      <Combobox.Option value={value.title} key={value.id}>
                        {({ active }) => (
                          <div
                            className={`px-3 py-2 ${
                              active
                                ? "bg-indigo-600 text-indigo-50"
                                : "bg-white"
                            }`}
                          >
                            {value.title}
                          </div>
                        )}
                      </Combobox.Option>
                    );
                  })}
                </Combobox.Options>
              </>
            )}
          </Combobox>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
