"use client";

import { getTargetSED } from "@/apis/targets/getTargetSED";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Tooltip,
  Scatter,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ScatterChart,
  Cell,
} from "recharts";

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export function Overview(params: { id: number }) {
  const { id } = params;
  const { data, isFetching } = useQuery({
    queryKey: ["targetSimbad"],
    queryFn: () => getTargetSED(id),
    initialData: [],
    select: (data) => {
      return data.map(
        (filterItem: {
          filter: string;
          flux: Array<number>;
          frequency: number;
        }) => ({
          filter: filterItem.filter,
          flux: filterItem.flux.map((fluxItem: number) => ({
            frequency: filterItem.frequency,
            flux: fluxItem,
          })),
        })
      );
    },
  });

  return (
    <div style={{ width: "100%", height: 350 }}>
      {!isFetching && data && (
        <ResponsiveContainer>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="frequency" name="frequency" />
            <YAxis type="number" dataKey="flux" name="flux" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            {data.map((item: { filter: string; flux: Array<number> }) => (
              <Scatter
                key={item.filter}
                name={`filter-${item.filter}`}
                data={item.flux}
                fill={getRandomColor()}
              >
                {item.flux.map((_, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
