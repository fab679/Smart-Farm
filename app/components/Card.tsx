import { Address, Farm, Location, PotatoHarvest, Region } from "@prisma/client";
import { AiOutlineArrowRight } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import moment from "moment";
import { Link } from "@remix-run/react";
export default function Card({
  data,
}: {
  data: PotatoHarvest & {
    farm: Farm & {
      address:
        | (Address & {
            location: Location & {
              region: Region;
            };
          })
        | null;
    };
  };
}) {
  return (
    <div className="relative m-4 w-64  overflow-hidden shadow-sm transition duration-150  hover:scale-105 hover:shadow-md">
      <p className="absolute top-1 right-1 z-20 rounded-full bg-lime-500 bg-opacity-70 bg-clip-padding p-2 text-xs font-medium text-lime-50  backdrop-blur backdrop-filter">
        {moment(data.createdAt, "YYYY-MM-DD").fromNow()}
      </p>

      <div className="relative">
        <img src={data.imgUrl} alt={data.variety} className="aspect-square" />
      </div>

      <div>
        <div className="flex items-center justify-between p-1">
          <div>
            <h4 className="text-base font-medium text-gray-600">
              {" "}
              {data.farm.name}
            </h4>
          </div>
          <div>
            <p className="flex items-center">
              <IoLocationOutline />
              {data.farm.address?.location.region.name}
            </p>
          </div>
        </div>
        <div className="flex  justify-center ">
          <h5 className="text-lg font-medium text-green-600">
            {data.variety} Potatoes
          </h5>
        </div>
        <div className="flex  justify-center ">
          <p className="text-base">
            <span className="mr-1 font-medium text-gray-800">
              {data.quantity}
            </span>
            <span className="text-gray-700">Bags available</span>
          </p>
        </div>
        <div className="flex  justify-center p-1 text-gray-700">
          <h4>
            @ <span className="font-medium text-red-600">{data.price}</span> KSH
            per bag
          </h4>
        </div>
        <div className="w-full">
          <Link
            to={`/potato/${data.id}`}
            className="flex w-full items-center justify-center bg-lime-600 px-6 py-3 text-lg font-medium uppercase text-lime-50 hover:bg-lime-700 hover:text-white"
          >
            View
            <span className="ml-2 flex items-center justify-center rounded-full bg-black/30 p-2 text-center">
              <AiOutlineArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
