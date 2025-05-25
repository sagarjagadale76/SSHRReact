"use client"

import * as React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AgGridReact } from "ag-grid-react"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import {WareHouseForm} from './WareHouseForm';
import { FileEdit, MapPin, Phone, Mail, Clock, Plus, Download, Printer, Search, RefreshCw, Filter, Building2, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function WareHousesTable() {
  const [rowData, setRowData] = React.useState([]);
  const [totalWareHouse, setTotalWareHouse] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [quickFilterText, setQuickFilterText] = React.useState("");
  const gridRef = React.useRef(null);
  const [showForm, setShowForm] = React.useState(false);  

  const navigate = useNavigate();

  // Custom grid theme styles
  const gridTheme = {
    '--ag-background-color': '#ffffff',
    '--ag-header-background-color': '#f8fafc',
    '--ag-header-foreground-color': '#1e293b',
    '--ag-odd-row-background-color': '#fafafa',
    '--ag-row-hover-color': '#f1f5f9',
    '--ag-selected-row-background-color': '#e0f2fe',
    '--ag-border-color': '#e2e8f0',
    '--ag-header-height': '48px',
    '--ag-row-height': '70px',
    '--ag-font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '--ag-font-size': '14px',
    '--ag-header-font-size': '14px',
    '--ag-header-font-weight': '600',
  }

  const fetchData = React.useCallback(() => {
    setLoading(true)
    setError(null)

    axios({
      method: "GET",
      url: "https://85nnezxl3m.execute-api.eu-west-2.amazonaws.com/dev/warehouses",
      headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
    })
      .then((response) => {
        const results = response.data.map((value) => ({
          WareHouseId: value.WareHouseId,
          Title: value.Title,
          OperationalCode: value.OperationalCode,
          ContactName: value.ContactName,
          Address1: value.Address1,
          Address2: value.Address2,
          Address3: value.Address3,
          Zip: value.Zip,
          Country: value.Country,
          Email: value.Email,
          Phone: value.Phone,
          WorkingHour: value.WorkingHour,
          TimeZone: value.TimeZone,
        }))

        setRowData(results)
        setTotalWareHouse(results.length)
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load warehouse data. Please try again.")
        setLoading(false)
        console.error("Error fetching warehouse data:", err)
      })
  }, [])

  const onGridReady = React.useCallback(
    (params) => {
      gridRef.current = params.api
      fetchData()
    },
    [fetchData],
  )  

  const editWarehouse = (warehouseId) => {
    navigate("/settings/warehouse/edit",{ state: {"Action": "Edit", "WareHouseId": warehouseId} });
    
  }

  const createWarehouse = () => {
    debugger;
    navigate("/settings/warehouse/create",{ state: {"Action": "Create new", "WareHouseId": null} });
  }

  const exportCSV = () => {
    gridRef.current.exportDataAsCsv({
      fileName: "warehouses.csv",
    })
  }

  const printGrid = () => {
    gridRef.current.setDomLayout("print")
    setTimeout(() => {
      gridRef.current.setDomLayout()
    }, 500)
  }

  const refreshData = () => {
    fetchData()
  }

  

  // Enhanced Column Definitions with better styling and filters
  const [colDefs] = React.useState([
    {
      field: "Title",
      headerName: "🏢 Warehouse Details",
      sortable: true,      
      flex: 1.2,
      minWidth: 220,
      filter: false,
      cellRenderer: (params) => (
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-base leading-tight">{params.value}</div>            
          </div>
        </div>
      ),
    },
    {
      headerName: "📍 Location",
      sortable: true,
      flex: 1.5,
      minWidth: 280,
      filter: false,
      valueGetter: (params) => {
        return [params.data.Address1, params.data.Address2, params.data.Zip, params.data.Country]
          .filter(Boolean)
          .join(', ')
      },
      cellRenderer: (params) => (
        <div className="flex items-start gap-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mt-1">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-800 leading-tight">
              {[params.data.Address1, params.data.Address2].filter(Boolean).join(", ")}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {[params.data.Zip, params.data.Country].filter(Boolean).join(", ")}
            </div>
          </div>
        </div>
      ),
    },
    {
      headerName: "👤 Contact Information",
      sortable: true,
      filter: false,
      flex: 1.3,
      minWidth: 260,
      valueGetter: (params) => {
        return [params.data.ContactName, params.data.Phone, params.data.Email]
          .filter(Boolean)
          .join(' ')
      },
      cellRenderer: (params) => (
        <div className="flex items-start gap-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mt-1">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="space-y-1 flex-1">
            {params.data.ContactName && (
              <div className="font-medium text-slate-800">{params.data.ContactName}</div>
            )}
            {params.data.Phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-3 w-3 text-emerald-600" />
                <span>{params.data.Phone}</span>
              </div>
            )}
            {params.data.Email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-3 w-3 text-blue-600" />
                <span className="truncate max-w-[180px]" title={params.data.Email}>
                  {params.data.Email}
                </span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      headerName: "⏰ Operating Hours",
      field: "WorkingHour",
      sortable: true,
      filter: false,
      filterParams: {
        filterOptions: ['contains', 'equals'],
        defaultOption: 'contains',
      },
      width: 180,
      cellRenderer: (params) => (
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <div className="text-center">
            <div className="font-medium text-slate-800 text-sm">
              {params.data.WorkingHour || "Not specified"}
            </div>
            {params.data.TimeZone && (
              <div className="text-xs text-slate-500">{params.data.TimeZone}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      headerName: "⚡ Actions",
      width: 140,
      cellRenderer: (params) => (
        <div className="flex justify-center py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => editWarehouse(params.data.WareHouseId)}
            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FileEdit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      ),
      sortable: false,
      filter: false,
      resizable: false,
      
        },
  ])

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800 mb-1">
                Warehouse Management
              </CardTitle>
              <p className="text-slate-600 text-sm font-medium">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading warehouses...
                  </span>
                ) : (
                  `Managing ${totalWareHouse} warehouse${totalWareHouse !== 1 ? 's' : ''} across your network`
                )}
              </p>
            </div>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3" 
            onClick={createWarehouse}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Warehouse
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search warehouses, locations, contacts..."
                className="pl-10 w-80 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                value={quickFilterText}
                onChange={(e) => setQuickFilterText(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData} 
              className="border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-slate-300 hover:border-green-500 hover:text-green-600 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Export & Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-slate-700 font-semibold">
                  Warehouse Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportCSV} className="hover:bg-green-50 hover:text-green-700">
                  <Download className="h-4 w-4 mr-3" />
                  Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={printGrid} className="hover:bg-blue-50 hover:text-blue-700">
                  <Printer className="h-4 w-4 mr-3" />
                  Print Grid
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div 
          className="ag-theme-alpine rounded-xl border border-slate-200 shadow-lg overflow-hidden" 
          style={{ height: "650px", width: "100%", ...gridTheme }}
        >
          <AgGridReact
            columnDefs={colDefs}
            ref={gridRef}
            rowData={rowData}            
            rowHeight={85}
            headerHeight={55}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50, 100]}
            animateRows={true}
            rowSelection="multiple"
            suppressCellFocus={true}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: false,
              floatingFilter: false,
              filterParams: {
                buttons: ['reset', 'apply'],
                closeOnApply: true,
              },
            }}
            loadingOverlayComponent={() => (
              <div className="flex flex-col items-center justify-center h-full bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <RefreshCw className="h-8 w-8 animate-spin text-white" />
                </div>
                <span className="text-xl font-semibold text-slate-700 mb-2">Loading Warehouses</span>
                <span className="text-sm text-slate-500">Please wait while we fetch your data...</span>
              </div>
            )}
            overlayNoRowsTemplate={`
              <div class="flex flex-col items-center justify-center h-full p-8">
                <div class="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mb-4">
                  <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-slate-700 mb-2">No Warehouses Found</h3>
                <p class="text-slate-500 text-center max-w-md">Try adjusting your search terms or filters, or add a new warehouse to get started.</p>
              </div>
            `}
            className="rounded-xl"
          />
        </div>
      </CardContent>      
    </Card>
  )
}