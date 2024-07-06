"use client";

import { getTargetSimbad } from "@/apis/targets/getTargetSimbad";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

export function Overview(params: { id: number }) {
  const { id } = params;
  const { data, isFetching } = useQuery({
    queryKey: ["targetSimbad"],
    queryFn: () => getTargetSimbad(id),
  });
  // TODO: 確認photometry的資料格式

  return (
    <ResponsiveContainer width="100%" height={350}>
      <>
        {!isFetching && data && (
          <ScatterChart
          // margin={{
          //   top: 20,
          //   right: 20,
          //   bottom: 20,
          //   left: 20,
          // }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="distance" name="distance" unit="cm" />
            <YAxis type="number" dataKey="velocity" name="velocity" unit="kg" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="A school" data={data} fill="#8884d8" />
          </ScatterChart>
        )}
      </>
    </ResponsiveContainer>
  );
}
