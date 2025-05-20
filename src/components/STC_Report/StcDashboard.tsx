import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DeliveryTrend from "./DeliveryTrends";
import { StcTable } from "./StcTable";

export default function StcDashboard({ stc_data }) {
  const totalShipments: number = stc_data.reduce(
    (sum, item) => sum + item.total_parcels,
    0
  );
  const totalOnTimeShipments: number = stc_data.reduce(
    (sum, item) => sum + item.total_on_time,
    0
  );
  const totalLateShipments = stc_data.reduce(
    (sum, item) => sum + item.total_late,
    0
  );
  const overallOnTimePercentage: number = parseFloat(
    ((totalOnTimeShipments / totalShipments) * 100).toFixed(2)
  );

  const FixedXAxis = XAxis as unknown as React.ComponentType<any>;
  const FixedYAxis = YAxis as unknown as React.ComponentType<any>;

  const deliveryStatusData = [
    {
      name: "On Time",
      value: totalOnTimeShipments,
      fill_color: "#71c174",
      font_color: "#4CAF50",
    },
    {
      name: "Late",
      value: totalLateShipments,
      fill_color: "#f7776e",
      font_color: "#F44336",
    },
  ];
  const CustomLegend = ({ payload }: { payload?: any }) => (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            color: deliveryStatusData[index].font_color || "#000",
            marginRight: 16,
          }}
        >
          <span
            style={{
              marginRight: 8,
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: 50,
              backgroundColor: entry.color,
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold mb-1">{`Destination: ${label}`}</p>
          {payload.map((entry, index) => {
            const isOnTime = entry.name === "On-Time %";
            const textColor = isOnTime ? "#4CAF50" : "#F44336"; // Green or Red
            return (
              <p key={index} style={{ color: textColor }}>
                {`${entry.name}: ${entry.value}%`}
              </p>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance Summary</CardTitle>
            <CardDescription>
              Showing details about delivery timelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold">{totalShipments}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <p className="text-sm text-gray-600">On-Time Delivery</p>
                <p className="text-2xl font-bold">{overallOnTimePercentage}%</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">On-Time Shipments</p>
                <p className="text-2xl font-bold">{totalOnTimeShipments}</p>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <p className="text-sm text-gray-600">Late Shipments</p>
                <p className="text-2xl font-bold">{totalLateShipments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deliveryStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    name,
                    percent,
                    cx,
                    cy,
                    outerRadius,
                    midAngle,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const x =
                      cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN);
                    const y =
                      cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN);
                    const entry = deliveryStatusData[index];
                    const labelColor = entry.font_color || "#000"; // fallback to black
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={labelColor} // Label text color
                        textAnchor={x > cx ? "start" : "end"}
                        fontSize={16}
                      >
                        {`${name}: ${(percent * 100).toFixed(1)}%`}
                      </text>
                    );
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill_color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Shipments"]} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>On-Time Performance by Destination</CardTitle>
            <CardDescription>
              Comparative analysis for delivery delays
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stc_data.filter(
                  (item) => item.destination !== "undefined"
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <FixedXAxis dataKey="destination" />
                <FixedYAxis
                  domain={[0, 100]}
                  tickFormatter={(tick) => `${tick}%`}
                />
                {/* <Tooltip
                    formatter={(value) => [`${value}%`, "On-Time Percentage"]}
                  /> */}
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                <Bar
                  dataKey="percentage_onTime"
                  name="On-Time %"
                  fill="#71c174"
                />
                <Bar dataKey="percentage_late" name="Late %" fill="#f7776e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <DeliveryTrend stc_data={stc_data} />
      </div>
    </>
  );
}
