import * as React from "react";

import { themeBalham } from "ag-grid-community";

import { Button } from "../ui/button";
import { AgGridReact } from "ag-grid-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import * as Papa from "papaparse";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function StcTable({ tableData, loading }) {
  const [rowData, setRowData] = React.useState([]);

  const myTheme = themeBalham.withParams({ accentColor: "red" });

  React.useEffect(() => {
    setRowData(tableData);
    //setLoading(false);
  }, [tableData]);

  // Download CSV handler
  const downloadCSV = () => {
    // Convert row data to CSV
    const csv = Papa.unparse(rowData);

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Excel handler
  const downloadExcel = () => {
    // Convert row data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(rowData);

    // Create workbook and download
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  // Download PDF handler
  const downloadPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set the title of the document
    doc.text("STC Data", 14, 15);

    // Use autoTable to create a table from the row data
    // Map column headers
    const headers = colDefs.map((col) => col.headerName);

    // Map row data to match headers
    const data = rowData.map((row) => [
      row.destination,
      row.avg_delivery_days,
      row.avg_delivery_days_ex_customs,
      row.total_parcels,
      row.total_late,
      row.percentage_onTime,
      row.total_on_time,
      row.percentage_late,
      row.total_delivery_exceptions,
      row.percentage_delivery_exceptions,
      row.total_in_transit,
      row.percentage_in_transit,
    ]);

    // Add the table to the PDF
    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: data,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        2: { halign: "right" }, // Right-align price column
      },
    });

    // Save the PDF
    doc.save("data.pdf");
  };

  const exportData = (format) => {
    switch (format) {
      case "csv":
        downloadCSV();
        break;
      case "xlsx":
        // gridApi.exportDataAsExcel();
        downloadExcel();
        break;
      case "pdf":
        downloadPDF();
        break;
      default:
        break;
    }
  };

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = React.useState([
    {
      field: "destination",
      headerName: " Destination",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Destination",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.destination}</>,
    },
    {
      field: "service",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Service",
      headerName: " Service",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>Starlinks Cross Border (SLG001)</>,
    },
    {
      field: "avg_delivery_days",
      headerName: " AVG. Days (INC. CUSTOMS)",
      sortable: true,
      flex: 1,
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "AVG. Days (INC. CUSTOMS)",
      cellRenderer: (params) => <>{params.data.avg_delivery_days}</>,
    },
    {
      field: "avg_delivery_days_ex_customs",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "AVG. Days (EXC. CUSTOMS)",
      headerName: " AVG. Days (EXC. CUSTOMS)",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.avg_delivery_days_ex_customs}</>,
    },
    {
      field: "total_parcels",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Total Parcels",
      headerName: " Total Parcels",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.total_parcels}</>,
    },
    {
      field: "total_on_time",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Total on time",
      headerName: " Total on time",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.total_on_time}</>,
    },
    {
      field: "percentage_onTime",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Percent on Time",
      headerName: " Percent on Time",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.percentage_onTime}%</>,
    },
    {
      field: "total_late",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Total Late",
      headerName: " Total Late",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.total_late}</>,
    },
    {
      field: "percentage_late",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Percent Late",
      headerName: " Percent Late",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.percentage_late}%</>,
    },
    {
      field: "total_delivery_exceptions",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Total Delivery Exceptions",
      headerName: " Total Delivery Exceptions",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.total_delivery_exceptions}</>,
    },
    {
      field: "percentage_delivery_exceptions",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Percent delivery exceptions",
      headerName: " Percent delivery exceptions",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => (
        <>{params.data.percentage_delivery_exceptions}%</>
      ),
    },
    {
      field: "percentage_in_transit",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Total in transit",
      headerName: " Total in transit",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.percentage_in_transit}</>,
    },
    {
      field: "percentage_in_transit",
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Percent in transit",
      headerName: " Percent in transit",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => <>{params.data.percentage_in_transit}%</>,
    },
  ]);

  return (
    <div>
      <div
        className="ag-theme-quartz"
        style={{
          height: "350px",
          maxWidth: "1400px",
          width: "100%",
          marginTop: "40px",
        }}
      >
        <AgGridReact
          theme={myTheme}
          rowData={rowData}
          columnDefs={colDefs}
          tooltipShowDelay={500}
          rowHeight={30}
          pagination={true}
          paginationAutoPageSize={true}
          defaultColDef={{
            wrapHeaderText: true,
            autoHeaderHeight: true,
            resizable: true,
          }}
          headerHeight={70}
        />
      </div>
      <div className="mt-4 flex flex-row-reverse">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-800 text-white">
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => exportData("csv")}>
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportData("xlsx")}>
              XLSX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportData("pdf")}>
              PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
