"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
const chartData = [
  { month: "Canada", desktop: 186 },
  { month: "USA", desktop: 305 },
  { month: "India", desktop: 237 },
  { month: "Australia", desktop: 73 },
  { month: "Germany", desktop: 209 },
  { month: "UK", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Total on time",
  },
} satisfies ChartConfig;

const FixedXAxis = XAxis as unknown as React.ComponentType<any>;

export default function DeliveryTrend({ stc_data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>On Time Deliveries</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={stc_data}
            margin={{ right: 30, left: 20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <FixedXAxis
              dataKey="destination"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="total_on_time"
              type="natural"
              fill="#71c174"
              fillOpacity={1}
              stroke="#71c174"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
