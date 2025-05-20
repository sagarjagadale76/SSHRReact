"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

const chartConfig = {
  created: {
    label: "Created",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const FixedXAxis = XAxis as unknown as React.ComponentType<any>;
const FixedYAxis = YAxis as unknown as React.ComponentType<any>;

export function ParcelSummary({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parcel Summary</CardTitle>
        <CardDescription>Created parcels over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <FixedYAxis
              dataKey="date"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string | number | Date) =>
                new Date(value).toLocaleDateString()
              }
              hide
            />
            <FixedXAxis dataKey="created" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="created"
              layout="vertical"
              fill="var(--color-created)"
              radius={4}
            >
              <LabelList
                dataKey="date"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
                formatter={(value) => new Date(value).toLocaleDateString()}
              />
              <LabelList
                dataKey="created"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total created parcels for the selected period
        </div>
      </CardFooter>
    </Card>
  );
}
