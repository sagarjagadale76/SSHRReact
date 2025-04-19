"use client"

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart"

import * as React from "react"

const chartData = [
  { date: '2023-06-01', created: 15, found: 7 },
  { date: '2023-06-02', created: 12, found: 9 },
  { date: '2023-06-03', created: 18, found: 11 },
  { date: '2023-06-04', created: 20, found: 8 },
  { date: '2023-06-05', created: 17, found: 13 },
  { date: '2023-06-06', created: 22, found: 15 },
  { date: '2023-06-07', created: 25, found: 10 },
]

const chartConfig = {
  created: {
    label: "Created",
    color: "hsl(var(--chart-1))",
  },
  found: {
    label: "Found",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function BatchStatistics({ data = chartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Statistics</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Legend />
              <Bar dataKey="created" fill="var(--color-created)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="found" fill="var(--color-found)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing created and found batches for the last 7 days
        </div>
      </CardFooter>
    </Card>
  )
}

