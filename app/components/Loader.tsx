import { FcProcess } from "react-icons/fc";

export default function Loader() {
  return (
    <div className="absolute inset-0 z-10 h-full w-full bg-white/50 bg-clip-padding backdrop-filter">
      <div className="flex h-full w-full items-center justify-center">
        <FcProcess className="h-10 w-10 animate-spin text-lime-600" />
      </div>
    </div>
  );
}
