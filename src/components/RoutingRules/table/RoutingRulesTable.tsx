import * as React from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import axios from "axios";

import { Checkbox } from "../../ui/checkbox";
import { Button } from "../../ui/button";
import { SquarePen, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

import { themeBalham } from "ag-grid-community";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { RoutingRule } from "../types/RoutingRule";
import { EditRoutingRuleForm } from "../EditRoutingRuleForm";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";

export function RoutingRulesTable({
  table_data,
  routingRuleFilterData,
  loading,
}) {
  const API_ENDPOINT =
    "https://s362b9tp8k.execute-api.eu-west-2.amazonaws.com/DEV/UpdateRoutingRules";
  const [rowData, setRowData] = React.useState([]);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedRule, setSelectedRule] = React.useState<RoutingRule | null>(
    null
  );

  //Delete Confirmation
  const [deleteDialog, setDeleteDialog] = React.useState({
    isOpen: false,
    recordId: null,
    recordName: "",
  });

  React.useEffect(() => {
    setRowData(table_data);
  }, [table_data]);

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  const onActiveToggle = (data: RoutingRule) => {
    setRowData((prev) =>
      prev.map((row) =>
        row.id === data.id
          ? { ...row, active: data.active === "Yes" ? "No" : "Yes" }
          : row
      )
    );
  };

  const onEdit = (data: RoutingRule) => {
    console.log("Edit clicked");
    setSelectedRule(data);
    setIsEditOpen(true);
  };

  const onDelete = (data: RoutingRule) => {
    console.log("Delete clicked");
    setDeleteDialog({
      isOpen: true,
      recordId: data.id,
      recordName: `Rule #${data.id}`,
    });
  };

  //Delete Confirmed
  const handleDeleteSuccess = (deletedId) => {
    if (deletedId) {
      setRowData((prev) => prev.filter((row) => row.id !== deletedId));
    }
  };

  const updateRoutingRuleTable = (rule) => {
    try {
      axios({
        method: "POST",
        url: API_ENDPOINT,
        headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
        data: rule,
      }).then(async (response) => {
        console.log("Check response: ", response);
      });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSave = (updatedRule: RoutingRule) => {
    console.log("Check the updated rule: ", updatedRule);
    setRowData((prev) =>
      prev.map((row) => (row.id === updatedRule.id ? updatedRule : row))
    );
    setIsEditOpen(false);
    setSelectedRule(null);
    updateRoutingRuleTable(updatedRule);
  };

  const handleCancel = () => {
    setIsEditOpen(false);
    setSelectedRule(null);
  };

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = React.useState<ColDef[]>([
    {
      field: "id",
      headerName: " ID",
      sortable: true,
      width: 80,
      cellRenderer: (params) => (
        <span className="text-gray-700">{params.data.id}</span>
      ),
    },
    {
      field: "active",
      headerName: " Active",
      sortable: true,
      width: 80,
      cellRenderer: (params: any) => (
        <div className="flex mt-2 justify-flex-start h-full">
          <Checkbox
            checked={params.data.active === "Yes"}
            onCheckedChange={() => onActiveToggle(params.data)}
          />
        </div>
      ),
    },
    {
      headerName: "Service (Code)",
      field: "service",
      flex: 1,
      sortable: true,
      autoHeight: true,
      cellRenderer: (params: any) => (
        <div className="whitespace-pre-wrap break-words text-sm py-2 text-gray-700">
          {params.data.service}
        </div>
      ),
    },
    {
      headerName: "Users",
      field: "users",
      width: 100,
      cellRenderer: (params: any) => {
        const users = (params.data.users || "").trim();
        let displayValue = "";

        if (users.toLowerCase() === "any") {
          displayValue = "Any";
        } else {
          const inclMatch = users.match(
            /incl\s+([^,]*(?:,[^,]*)*?)(?:\s*,?\s*excl|$)/i
          );
          if (inclMatch) {
            displayValue = inclMatch[1]
              .replace(/\s+/g, " ")
              .replace(/,\s*$/, "")
              .trim()
              .replace(/,/g, ",\n");
          }
        }

        return (
          <div className="whitespace-pre-wrap break-words text-sm py-2 text-gray-700">
            {displayValue}
          </div>
        );
      },
    },
    {
      headerName: "Excluded Users",
      field: "excluded_users",
      flex: 1,
      cellRenderer: (params: any) => {
        const users = (params.data.users || "").trim();
        let displayValue = "";

        if (users.toLowerCase() === "any") {
          displayValue = "";
        } else {
          const exclMatch = users.match(/excl\s+([^,]*(?:,[^,]*)*?)$/i);
          if (exclMatch) {
            displayValue = exclMatch[1]
              .replace(/\s+/g, " ")
              .replace(/,\s*$/, "")
              .trim()
              .replace(/,/g, ",\n");
          }
        }

        return (
          <div className="whitespace-pre-wrap break-words text-sm py-2 text-gray-700">
            {displayValue}
          </div>
        );
      },
    },
    {
      headerName: "Warehouse",
      field: "warehouse",
      flex: 1,
      sortable: true,
      autoHeight: true,
      cellRenderer: (params: any) => (
        <div className="whitespace-pre-wrap break-words text-sm py-2 text-gray-700">
          {params.data.warehouse}
        </div>
      ),
    },
    {
      headerName: "Country",
      field: "country",
      flex: 1,
      sortable: true,
      autoHeight: true,
      cellRenderer: (params: any) => (
        <div className="whitespace-pre-wrap break-words text-sm py-2 text-gray-700">
          {params.data.country}
        </div>
      ),
    },
    {
      headerName: "Conditions",
      field: "Conditions",
      flex: 2,
      sortable: true,
      autoHeight: true,
      cellRenderer: (params: any) => {
        const conditions = params.data.conditions || "";
        const lines = conditions.split("\n");

        return (
          <div className="py-2 text-sm leading-tight">
            {lines.map((line, index) => {
              if (line.startsWith("**Comment:**")) {
                return (
                  <div key={index} className="font-semibold text-gray-700 mt-2">
                    Comment:
                  </div>
                );
              } else if (line.trim() && !line.startsWith("**")) {
                return (
                  <div
                    key={index}
                    className="text-gray-700 break-words whitespace-pre-wrap"
                  >
                    {line}
                  </div>
                );
              } else if (line.trim() && line.startsWith("**")) {
                return null;
              } else {
                return line.trim() ? (
                  <div
                    key={index}
                    className="text-gray-600 text-xs break-words whitespace-pre-wrap"
                  >
                    {line}
                  </div>
                ) : null;
              }
            })}
          </div>
        );
      },
    },
    {
      headerName: "Priority",
      field: "priority",
      width: 80,
      sortable: true,
      cellRenderer: (params: any) => (
        <span className="font-bold text-gray-700">{params.data.priority}</span>
      ),
    },
    {
      headerName: "Carrier",
      field: "carrier",
      flex: 2,
      sortable: true,
      cellRenderer: (params: any) => (
        <span className="font-bold text-gray-700">{params.data.carrier}</span>
      ),
    },
    {
      headerName: "Actions",
      width: 100,
      cellRenderer: (params: any) => (
        <div className="flex gap-1 items-center justify-end h-full pr-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-blue-600 hover:text-blue-800"
                onClick={() => onEdit(params.data)}
              >
                <SquarePen className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Rule</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-orange-600 hover:text-orange-800"
                onClick={() => onDelete(params.data)}
              >
                <Trash2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Rule</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ]);

  return (
    <div className="px-4 pb-6 flex-1 overflow-hidden">
      <div className="space-y-4">
        <TooltipProvider>
          <div className="ag-theme-quartz rounded-xl w-full h-full custom-ag-grid">
            <style>{`
              .custom-ag-grid{
                 color: #978f8f !important;
                 
                 border-radius:8px !important;
              }
              .custom-ag-grid .ag-header {
                background-color: #f5f5f5 !important;
                border-bottom: 1px solid #e5e5e5 !important;
                font-weight:600
              }

              .custom-ag-grid .ag-header-cell {
                background-color: #f5f5f5 !important;
                color: #7f8287!important;
                font-weight: 600 !important;
                
              }

              .custom-ag-grid .ag-row {
                border-bottom: 1px solid #f0f0f0 !important;
              }

              .custom-ag-grid .ag-cell {
                color: #978f8f !important;
              }

              .ag-root-wrapper {
                border-radius: 10px !important;
              }

              .custom-ag-grid .ag-paging-panel {
                background-color: #ffffff !important;
                border-top: 1px solid #e5e5e5 !important;
                padding: 20px 16px !important;
                color: #6b7280 !important;
              }

              .custom-ag-grid .ag-paging-button {
                color: #6b7280 !important;
                margin: 0 4px !important;
              }

              .custom-ag-grid .ag-paging-button:hover {
                color: #374151 !important;
                background-color: #f9fafb !important;
              }

              .custom-ag-grid .ag-paging-button.ag-disabled {
                color: #d1d5db !important;
              }

              .custom-ag-grid .ag-paging-description {
                color: #6b7280 !important;
                font-size: 14px !important;
              }
            `}</style>
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              rowHeight={30}
              headerHeight={48}
              pagination={true}
              paginationAutoPageSize={true}
              defaultColDef={{
                resizable: true,
              }}
              animateRows={true}
              domLayout="normal"
              onGridReady={onGridReady}
            />
          </div>
        </TooltipProvider>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
            <DialogHeader className="sticky top-0 z-10 bg-white border-b p-4 flex flex-row items-center justify-between">
              <DialogTitle>Edit routing rule {selectedRule?.id}</DialogTitle>
              <DialogClose asChild>
                <button className="text-gray-500 hover:text-black">
                  <X className="h-5 w-5" />
                </button>
              </DialogClose>
            </DialogHeader>
            <div className="overflow-y-auto p-4 flex-1">
              {selectedRule && (
                <EditRoutingRuleForm
                  rule={selectedRule}
                  routingTableData={table_data}
                  routingRuleFilterData={routingRuleFilterData}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        <DeleteConfirmationDialog
          isOpen={deleteDialog.isOpen}
          onClose={() =>
            setDeleteDialog({ isOpen: false, recordId: null, recordName: "" })
          }
          recordId={deleteDialog.recordId}
          recordName={deleteDialog.recordName}
          apiEndpoint="/api/routing-rules"
          onDeleteSuccess={(recordId) => handleDeleteSuccess(recordId)}
        />
      </div>
    </div>
  );
}
