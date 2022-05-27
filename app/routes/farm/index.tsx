import { useLoaderData } from "@remix-run/react";
import {
  Bar,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryPie,
} from "victory";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import {
  getFarmEarnings,
  getFarmOrderItemsCount,
  getFarmOrdersByPotatoType,
  getFarmOrdersByVariety,
} from "~/models/farm.server";
import { getFarmId } from "~/session.server";

interface LoaderData {
  numberofOrders: Awaited<ReturnType<typeof getFarmOrderItemsCount>>;
  totalEarnings: Awaited<ReturnType<typeof getFarmEarnings>>;
  completedOrders: Awaited<ReturnType<typeof getFarmOrdersByPotatoType>>;
  farmorders: Awaited<ReturnType<typeof getFarmOrdersByVariety>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const farmId = (await getFarmId(request)) as string;

  return json<LoaderData>(
    {
      numberofOrders: await getFarmOrderItemsCount(farmId),
      totalEarnings: await getFarmEarnings(farmId),
      completedOrders: await getFarmOrdersByPotatoType(farmId),
      farmorders: await getFarmOrdersByVariety(farmId),
    },
    { status: 200 }
  );
};

export default function index() {
  const loaderData = useLoaderData() as LoaderData;
  const groupeNumberOfOrdersByDate = loaderData.completedOrders.reduce(
    (acc, order) => {
      const date = new Date(order.createdAt);
      const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!acc[dateString]) {
        acc[dateString] = 0;
      }
      acc[dateString] += 1;
      return acc;
    },
    {} as { [key: string]: number }
  );
  const groupFarmOrdersByVariety = loaderData.farmorders.reduce(
    (acc, order) => {
      if (!acc[order.variety]) {
        acc[order.variety] = 0;
      }
      acc[order.variety] = order.orderItems.length;
      return acc;
    },
    {} as { [key: string]: number }
  );

  console.log(groupFarmOrdersByVariety);
  return (
    <div className="container mx-auto p-2 ">
      <div>
        <h1 className="text-center">
          <span className="text-2xl font-medium text-gray-700">Dashboard</span>
        </h1>
      </div>
      <div className="flex justify-between">
        <div className="relative max-w-md">
          <svg viewBox="0 0 400 400">
            <VictoryPie
              standalone={false}
              width={400}
              height={400}
              data={Object.entries(groupFarmOrdersByVariety).map(
                ([variety, numberOfOrders]) => ({
                  x: variety,
                  y: numberOfOrders,
                })
              )}
              innerRadius={68}
              labelRadius={100}
              style={{
                labels: {
                  fill: "white",
                  fontSize: 12,
                  fontWeight: "bold",
                },
              }}
            />
            <VictoryLabel
              textAnchor="middle"
              style={{
                fontSize: 20,
              }}
              x={200}
              y={200}
              text="Variety"
            />
          </svg>
        </div>
        <div className="relative max-w-md">
          <VictoryChart
            height={400}
            width={400}
            domainPadding={{ x: 50, y: [0, 20] }}
            scale={{ x: "time" }}
          >
            <VictoryBar
              data={Object.entries(groupeNumberOfOrdersByDate).map(
                ([date, numberOfOrders]) => ({
                  x: date,
                  y: numberOfOrders,
                })
              )}
              style={{
                data: {
                  fill: "#c43a31",
                },
              }}
              dataComponent={<Bar className="bg-lime-500" />}
            />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
}
