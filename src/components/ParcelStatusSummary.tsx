import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import * as React from "react"

export function ParcelStatusSummary({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Today</TableHead>
          <TableHead>Yesterday</TableHead>
          <TableHead>Previous 7 Days</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data.today).map(([status, _]) => (
          <TableRow key={status}>
            <TableCell className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</TableCell>
            <TableCell>{data.today[status]}</TableCell>
            <TableCell>{data.yesterday[status]}</TableCell>
            <TableCell>{data.previousWeek[status]}</TableCell>
            <TableCell>{data.total[status]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

