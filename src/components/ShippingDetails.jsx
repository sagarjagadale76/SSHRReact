import { AllCommunityModule, ClientSideRowModelModule,provideGlobalGridOptions, themeBalham  } from "ag-grid-community";
// Theme
import { ModuleRegistry } from "ag-grid-community";
//import { AgGridReact } from '@ag-grid-community/react';
import React, { Component, useState,useCallback,useRef } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
//import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CgAdd } from "react-icons/cg";
import { FaDownload } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
//import { createRoot } from 'react-dom/client';
import  ReactDOM  from "react-dom/client";
import  "./ShippingDetails.module.css";
import NewBatchPopup from "./NewBatchPopup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BatchAuditDialog from './BatchAuditDialog'
import { Button } from "./ui/button"


ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

//const root = ReactDOM.createRoot(document.getElementById("root"));

export default class ShippingDetails extends React.Component{ 
 
    render() {
        return (           
                
            <div style={{height:"400px"}}>
            <GridExample/>                
            </div>
            
          );
        }
}


     
const GridExample = () => {
  let navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [batchId, setBatchId] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const myTheme = themeBalham.withParams({ accentColor: 'red' });
  const gridRef = useRef(null);
  
  const isOpen = useRef(false);
        // Row Data: The data to be displayed.
        
      // const onGridReady = (params) => {
      //   debugger;
      //   const fetchGridData =() => {
      //     // Fetch data
            
      //     axios(
      //       {
      //           method: "GET",
      //           url: "https://35kkdepo1j.execute-api.eu-west-2.amazonaws.com/dev/batches",
      //           headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
      //       }            
      //   ).then(response => {          
      //     const results = [];
      //     const batchIdList = [];          
      //     // Store results in the results array
      //     response.data.forEach((value) => {
      //       batchIdList.push(value.BatchId);
      //       results.push({
      //           id: value.BatchId,
      //           fileName: value.FileName,
      //           created: value.CreatedDate,
      //           status: value.Status,
      //           parcels: value.Parcels,
      //           user: value.ShipperName,
      //       });
      //     }); 

      //     setBatchCount(batchIdList.length);
      //     setBatchId(Math.max(...batchIdList));
      //     setRowData(results);                         
      //   });    
        
      // }

      // useEffect(() => {fetchGridData()},[]);        
      // };

      const onGridReady = useCallback((params) => {
        debugger;
        axios(
          {
              method: "GET",
              url: "https://35kkdepo1j.execute-api.eu-west-2.amazonaws.com/dev/batches",
              headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
          }            
      )
      .then(response => { 
        debugger;         
        const results = [];
        const batchIdList = [];          
        // Store results in the results array
        response.data.forEach((value) => {
          batchIdList.push(value.BatchId);
          results.push({
              id: value.BatchId,
              fileName: value.FileName,
              created: value.CreatedDate,
              status: value.Status,
              parcels: value.Parcels,
              user: value.ShipperName,
          });
        }); 

        setBatchCount(batchIdList.length);
        setBatchId(Math.max(...batchIdList));
        setRowData(results);                         
      });
      }, []);
    
        
      // const viewBatch =(e) => {
      //   debugger;
      //   var shipper = selectedRow[0];
        
      // };

      

      const onCellClicked = useCallback((e) => {
        debugger;       
        if(e.colDef.field == "details"){
          isOpen.current = true;
          const sampleData = 
            {
              id: e.data.id,
              created : e.data.created,
              user: e.data.user,
              type: "default",
              status:  e.data.status,
              parcelsFound: e.data.parcels,
              parcelsCreated: e.data.parcels,
              fileName:  e.data.fileName
            }
                  
          
          navigate('/BatchAuditDialog',{ state : {"isOpen" : isOpen.current,"isClose" :false, "data" : sampleData}});
        }
      },[]);

      
        // Column Definitions: Defines the columns to be displayed.
        const [colDefs, setColDefs] = useState([
            { headerName: "ID", field: "id", width: 80,  sortable:true, filter: true},
            {
              headerName: "File Name",
              field: "fileName",
              cellRenderer: (params) => (
                <a style={{color:"#00B0B3"}}><FaDownload style={{color:"#00B0B3"}}/>
                  {params.value}
                </a>
              ),
            },
            { headerName: "Created", field: "created", width: 200 },
            {
              headerName: "Status",
              field: "status",
              cellStyle: (params) => ({
                color: params.value === "Finished" ? "green" : "red",
                fontWeight: "bold",
              }),
            },
            {
              headerName: "Parcels",
              field: "parcels",
              autoHeight: true,
              cellRenderer: (params) => (
                <>
                  <a style={{color:"#00B0B3"}}>{`${params.value} found`}</a>
                  <br/>               
                  <a href="#" style={{color:"#00B0B3",textDecoration:"underline"}}>{`${params.value} created`}</a>                  
                </>
              ),
            },
            { headerName: "User", field: "user", width: 200 },
            {
              headerName: "",
              field: "details",
              cellRenderer: () => (
                <a style={{color:"#00B0B3"}}><FaEye style={{color:"#00B0B3"}} />View details</a>
              ),
            },        
        ]);  
        
        const defaultColDef = {
            flex: 1,
        };
    
        // Container: Defines the grid's theme & dimensions.
        return (
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Batches</h1>
          <p className="text-gray-600">The total Number of batches: {batchCount}</p>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600" onClick={e => {
                                    debugger;
                                        navigate('/NewBatch',{ state: batchId });
                                    }} >
        NEW BATCH
        </Button>
      </div>
      <div className="ag-theme-quartz" style={{ height: "600px", width: "100%", marginTop:"40px" }} >
        <AgGridReact
           ref={gridRef}
          theme={myTheme}
          rowData={rowData}
          columnDefs={colDefs}
          rowHeight={30}          
          alwaysShowHorizontalScroll={true}
          onGridReady = {onGridReady}
          onCellClicked={onCellClicked}
          pagination={true}
          defaultColDef={{
            resizable: true,            
          }}
        />
      </div>      
    </div>
    
        );
       
       };

       
       
       
    

