"use client"
import * as React from 'react';
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ParcelSummary } from "./ParcelSummary"
import { ParcelStatistics } from "./ParcelStatistics"
import { ParcelStatusSummary } from "./ParcelStatusSummary"
import { BatchStatistics } from "./BatchStatistics"
import { BatchSummary } from "./BatchSummary"
import { DateRangePicker } from "./DateRangePicker"
import { parcelData, parcelStatuses, parcelStatusSummary, batchDistribution, batchSummary } from "./lib/mock-data"
import { Package, CheckCircle2, Truck, AlertCircle } from "lucide-react"
import { Sidebar } from './Sidebar';

const chartData = [
  { date: "2023-06-01", created: 15, found: 7 },
  { date: "2023-06-02", created: 12, found: 9 },
  { date: "2023-06-03", created: 18, found: 11 },
  { date: "2023-06-04", created: 20, found: 8 },
  { date: "2023-06-05", created: 17, found: 13 },
  { date: "2023-06-06", created: 22, found: 15 },
  { date: "2023-06-07", created: 25, found: 10 },
]

export  function DashboardContent() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  const [filteredParcelData, setFilteredParcelData] = React.useState(parcelData)
  const [filteredParcelStatuses, setFilteredParcelStatuses] = useState(parcelStatuses)
  const [filteredParcelStatusSummary, setFilteredParcelStatusSummary] = useState(parcelStatusSummary)
  const [filteredBatchDistribution, setFilteredBatchDistribution] = useState(batchDistribution)
  const [filteredBatchSummary, setFilteredBatchSummary] = useState(batchSummary)

  useEffect(() => {
    // Filter parcelData based on date range
    const filtered = parcelData.filter((item) => {
      const itemDate = new Date(item.date)
      if (dateRange.from && dateRange.to) {
        return itemDate >= dateRange.from && itemDate <= dateRange.to
      }
      if (dateRange.from) {
        return itemDate >= dateRange.from
      }
      if (dateRange.to) {
        return itemDate <= dateRange.to
      }
      return true
    })

    setFilteredParcelData(filtered)
    setFilteredParcelStatuses(parcelStatuses)
    setFilteredParcelStatusSummary(parcelStatusSummary)
    setFilteredBatchDistribution(batchDistribution)
    setFilteredBatchSummary(batchSummary)
  }, [dateRange])

  return (
    
    
    <div className="space-y-4">     
          
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Date Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangePicker
            date={dateRange}
            setDate={(newDateRange) => setDateRange(newDateRange || { from: undefined, to: undefined })}
          />
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total Parcels</p>
              <p className="text-4xl font-bold">15,789</p>
              <p className="text-sm text-muted-foreground">Total processed parcels</p>
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-blue-500/15 p-3">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-4xl font-bold">12,567</p>
              <p className="text-sm text-muted-foreground">Successfully delivered</p>
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-green-500/15 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">In Transit</p>
              <p className="text-4xl font-bold">2,100</p>
              <p className="text-sm text-muted-foreground">Currently in transit</p>
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-yellow-500/15 p-3">
              <Truck className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Late Deliveries</p>
              <p className="text-4xl font-bold">789</p>
              <p className="text-sm text-muted-foreground">Delayed shipments</p>
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-red-500/15 p-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ParcelSummary data={filteredParcelData} />
        <ParcelStatistics  />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Parcel Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ParcelStatusSummary data={filteredParcelStatusSummary} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Batch Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <BatchStatistics data={chartData} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Batch Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <BatchSummary data={filteredBatchSummary} />
        </CardContent>
      </Card>
    </div>
  )
}

