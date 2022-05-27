import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { getFarmPotatoes } from "~/models/farm.server";
import { getFarmId } from "~/session.server";
import moment from "moment";
interface LoaderData {
  potatoes: Awaited<ReturnType<typeof getFarmPotatoes>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const farm = (await getFarmId(request)) as string;
  return json<LoaderData>({
    potatoes: await getFarmPotatoes(farm),
  });
};

export default function index() {
  const loaderData = useLoaderData() as LoaderData;

  return (
    <table className=" w-full table-auto">
      <thead className="table-header-group border-b">
        <tr className="table-row">
          <th className="table-cell py-4">Id</th>
          <th className="table-cell py-4">Image</th>
          <th className="table-cell py-4">Variety</th>
          <th className="table-cell py-4">Quantity</th>
          <th className="table-cell py-4">Last Updated</th>
          <th className="table-cell py-4">Update</th>
        </tr>
      </thead>
      <tbody className="table-row-group">
        {loaderData.potatoes.length > 0 ? (
          loaderData.potatoes.map((potato) => (
            <tr className="table-row hover:bg-gray-50" key={potato.id}>
              <td className="table-cell border  p-2">{potato.id}</td>
              <td className="table-cell border  p-2">
                <img
                  src={potato.imgUrl}
                  alt={potato.variety}
                  className="h-16 "
                />
              </td>
              <td className="table-cell border  p-2">{potato.variety}</td>
              <td className="table-cell border  p-2">{potato.quantity} bags</td>
              <td className="table-cell border  p-2">
                {moment(potato.createdAt, "YYYYMMDD").fromNow()}
              </td>
              <td className="table-cell border  p-2">
                <Link to={`${potato.id}`} className="text-base text-lime-500">
                  Update
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <p>No items in the Inventory Please add. </p>
        )}
      </tbody>
    </table>
  );
}
