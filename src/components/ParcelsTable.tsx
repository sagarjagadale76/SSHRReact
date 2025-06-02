import { Button } from "./ui/button"
import { Card } from "./ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { FileText, MapPin, Truck, Download, Printer, Package, User, Clock, Edit, Search, RefreshCw, Filter } from 'lucide-react'
import * as React from 'react';

import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
//import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import "ag-grid-community/styles/ag-theme-alpine.css";
import { themeBalham  } from "ag-grid-community";
import { useAuth } from './contexts/AuthContext'

export function ParcelsTable() {

  const [rowData, setRowData] = React.useState([]);
  const [totalParcel, setTotalParcel] = React.useState(0);
  const myTheme = themeBalham.withParams({ accentColor: 'red' });
  let navigate = useNavigate();
  const { user } = useAuth();

   // Custom grid theme styles - Updated to match warehouse style
  const gridTheme = {
    '--ag-background-color': '#ffffff',
    '--ag-header-background-color': '#f8fafc',
    '--ag-header-foreground-color': '#1e293b',
    '--ag-odd-row-background-color': '#fafafa',
    '--ag-row-hover-color': '#f1f5f9',
    '--ag-selected-row-background-color': '#e0f2fe',
    '--ag-border-color': '#e2e8f0',
    '--ag-header-height': '48px',
    '--ag-row-height': '80px',
    '--ag-font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '--ag-font-size': '14px',
    '--ag-header-font-size': '14px',
    '--ag-header-font-weight': '600',
  }
  
  const onGridReady = React.useCallback((params) =>  {    
   
    axios(
      {
          method: "GET",
          url: "https://7uwv62mcpb.execute-api.eu-west-2.amazonaws.com/dev/shipmentdetails",
          headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
      }            
  )
  .then(response => { 
         
    const results = [];
    // Store results in the results array
    response.data.map((value) => {
       results.push({
        CustomerReference: value.CustomerReference,
        TrackingNumber: value.TrackingNumber,
        OrderReference: value.OrderReference,
        ConsigneeName: value.ConsigneeName,
        ConsigneeAddress1: value.ConsigneeAddress1,
        ConsigneeAddress2: value.ConsigneeAddress2,
        ConsigneeAddress3: value.ConsigneeAddress3,
        Zip: value.Zip,
        ConsigneeCountry: value.ConsigneeCountry,
        BatchId : value.BatchId,
        ServiceId : value.ServiceId,
        ServiceName:"TrackPak Worldwide",
        ShipperCompany : value.ShipperConf,
        ZplLabel : value.ZplLabel
        
      });
    }); 

    setRowData(results);
    setTotalParcel(results.length);                   
  });
  }, []);

   // Column Definitions: Updated to match warehouse style
   const [colDefs, setColDefs] = React.useState([
    { 
      headerName: "📦 Labels",
      sortable: true,      
      flex: 1.2,
      minWidth: 220,
      cellRenderer: (params) => (
        <div className="flex items-center gap-3 py-2">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 mb-1">System label</div>
            <div className="flex gap-2 text-sm">
              <button onClick={() => onDownloadPdf(params.data.ZplLabel, params.data.ConsigneeName)} className="text-[#4AA3BA] hover:underline flex items-center gap-1">
                <FileText className="h-4 w-4" />
                PDF
              </button>
              {" | "}
              <button onClick={() => downloadFile(params.data.ZplLabel,'text/plain','label.zpl')} className="text-[#4AA3BA] hover:underline">
                ZPL
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      headerName: "🕒 Created/Accepted",
      sortable:true,
      flex: 1.5,
      minWidth: 280,
      cellRenderer: (params) => (
        <div className="flex items-center gap-2 py-2">
          <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-900">09:45 (UTC)</div>
            <div className="text-sm text-gray-500">19 Dec 2024</div>
          </div>
        </div>
      )
    },
    { 
      headerName: "📋 Reference/Tracking", 
      cellRenderer: (params) => (
        <div className="py-2">
          <div className="mb-2">
            <button onClick={() => navigate("/ParcelForm", { state: { CustomerReference: params.data.CustomerReference}})} className="text-[#4AA3BA] hover:underline flex items-center gap-1 font-medium" >
              <FileText className="h-4 w-4" />
              Details
            </button>
          </div>
          <div className="space-y-1 text-sm">                        
            <div>
              <span className="font-medium text-gray-700">System#:</span> 
              <span className="text-gray-900 ml-1">{params.data.TrackingNumber}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Customer#:</span> 
              <span className="text-gray-900 ml-1">{params.data.CustomerReference}</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-medium text-gray-700">Order#:</span>
              <span className="text-gray-900">{params.data.OrderReference}</span>                          
            </div>
          </div>
        </div>
      ),
      autoHeight: true  
    },
    {
      headerName: "👤 Consignee information",
      cellRenderer: (params) => (
        <div className="py-2">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-purple-500" />
            <span className="font-medium text-gray-900">{params.data.ConsigneeName}</span>
          </div>
          <div className="text-sm text-gray-500 ml-6">
            <div>{params.data.ConsigneeAddress1 + ',' + params.data.ConsigneeAddress2}</div>
            <div>{params.data.Zip}</div>
            <div>{params.data.ConsigneeCountry}</div>  
          </div>
        </div>
      )
    },
    {
      headerName: "🚚 Service",
      autoHeight: true,
      cellRenderer: (params) => (
        <div className="flex items-center gap-2 py-2">
          <Truck className="h-4 w-4 text-green-500 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-900">{params.data.ServiceName}</div>
            <div className="text-sm text-gray-500">({params.data.ServiceId})</div>                  
          </div>
        </div>
      ),
    },
    { 
      headerName: "📊 Status",
      cellRenderer: (params) => (
        <div className="py-2">
          <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600 ring-1 ring-inset ring-orange-500/10">
            Created
          </span>                 
        </div>
      ),  
      width: 200 
    },
    {
      headerName: "📁 Source",
      cellRenderer: (params) => (
        <div className="py-2">
          <div className="text-sm">
            <span className="font-medium text-gray-700">BatchId:</span>
            <span className="text-gray-900 ml-1">{params.data.BatchId}</span>
          </div>
        </div>
      ),
    },        
]);


const downloadFile = (zplContent, mediatype, linkToDownload) => {
  
  const blob = new Blob([zplContent], { type: mediatype })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = linkToDownload
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}




const onDownloadPdf = React.useCallback((shippingLabelPDF, consigneeName) =>  {

  var zplLabel = JSON.stringify(shippingLabelPDF, null, 2);
   
  axios(
    {
        method: "POST",
        url: "https://7uwv62mcpb.execute-api.eu-west-2.amazonaws.com/dev/shipmentpdflabel",
        headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
        data: zplLabel,
    }            
)
.then(response => { 
       debugger;

       downloadAsPDF(response.data, consigneeName);
                    
});
}, []);

function downloadAsPDF(data,consigneeName) {
  debugger;
  var base64String = data;

  if (base64String.startsWith("JVB")) {
    base64String = "data:application/pdf;base64," + base64String;
    downloadFileObject(base64String,consigneeName);
  } else if (base64String.startsWith("data:application/pdf;base64")) {
    downloadFileObject(base64String, consigneeName);
  } else {
    alert("Not a valid Base64 PDF string. Please check");
  }

}

function downloadFileObject(base64String, name) {
  const linkSource = base64String;
  const downloadLink = document.createElement("a");
  const fileName = 'ShippingLabel-' + name + '.pdf';
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

function openCreateParcelForm()
{
  
  navigate("/CreateParcelForm");
}

  return (
     <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header - Updated to match warehouse style */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parcels list</h1>
            <p className="text-gray-600">The total number of parcels: {totalParcel}</p>
          </div>
        </div>
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium" 
          onClick={openCreateParcelForm}
        >
          + CREATE NEW PARCEL
        </Button>
      </div>      

      {/* Grid Container - Updated styling */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        

        <div className="space-y-4 p-4">
          <Button variant="outline">ACTION</Button>
          <div 
              className="ag-theme-alpine rounded-xl border border-slate-200 shadow-lg overflow-hidden" 
              style={{ height: "650px", width: "100%", ...gridTheme }}
            >
            <AgGridReact
              theme={myTheme}
              rowData={rowData}
              columnDefs={colDefs}
              rowHeight={80}
              headerHeight={48}
              alwaysShowHorizontalScroll={true}
              onGridReady = {onGridReady}
              pagination={true}
              paginationAutoPageSize={true}
              defaultColDef={{
                resizable: true,            
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

