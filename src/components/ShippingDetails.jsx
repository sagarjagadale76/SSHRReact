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
import { FaSearch, FaSync } from "react-icons/fa";
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
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [batchId, setBatchId] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const myTheme = themeBalham.withParams({ accentColor: 'red' });
  const gridRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    createDateFrom: '',
    createDateTo: '',
    status: 'All'
  });

  const handleSuccess = () => {
    console.log('Upload successful!');
    // You can add navigation or notification logic here
  };


  const isOpen = useRef(false);        

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
        setFilteredRowData(results); // Initialize filtered data                        
      });
      }, []);

      // Filter functions
      const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
          ...prev,
          [filterType]: value
        }));
      };

      const applyFilters = () => {
        let filtered = [...rowData];

        // Date range filter
        if (filters.createDateFrom) {
          const fromDate = new Date(filters.createDateFrom);
          filtered = filtered.filter(item => {
            const itemDate = new Date(item.created);
            return itemDate >= fromDate;
          });
        }

        if (filters.createDateTo) {
          const toDate = new Date(filters.createDateTo);
          filtered = filtered.filter(item => {
            const itemDate = new Date(item.created);
            return itemDate <= toDate;
          });
        }

        // Status filter
        if (filters.status !== 'All') {
          filtered = filtered.filter(item => item.status === filters.status);
        }

        setFilteredRowData(filtered);
      };

      const clearFilters = () => {
        setFilters({
          createDateFrom: '',
          createDateTo: '',
          status: 'All'
        });
        setFilteredRowData(rowData);
      };
        
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
            { 
              headerName: "📁 Batch Details", 
              field: "batch",
              flex: 1,
              minWidth: 180,
              sortable: true, 
              filter: true,
              cellRenderer: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                  <div style={{
                    backgroundColor: '#4F80FF',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    📁
                  </div>
                  <span style={{ fontWeight: '500', color: '#333' }}>
                    Batch {params.data.id}
                  </span>
                </div>
              ),
            },
            {
              headerName: "📍 File Information",
              field: "fileName",
              flex: 2,
              minWidth: 250,
              cellRenderer: (params) => (
                <div style={{ padding: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <div style={{
                      backgroundColor: '#FF6B6B',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '50%',
                      fontSize: '10px',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      📍
                    </div>
                    <div style={{ color: '#333', fontWeight: '500' }}>
                      {params.value}
                    </div>
                  </div>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: '22px' }}>
                    <FaDownload style={{color:"#00B0B3", marginRight: '4px'}} />
                    Download available
                  </div>
                </div>
              ),
            },
            {
              headerName: "👤 Processing Info",
              field: "processing",
              flex: 2,
              minWidth: 220,
              cellRenderer: (params) => (
                <div style={{ padding: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <div style={{
                      backgroundColor: '#9C27B0',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '50%',
                      fontSize: '10px',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      👤
                    </div>
                    <div style={{ color: '#333', fontWeight: '500' }}>
                      {params.data.user}
                    </div>
                  </div>
                  <div style={{ color: '#666', fontSize: '12px', marginLeft: '22px' }}>
                    📞 {params.data.created}
                  </div>
                  <div style={{ color: '#00B0B3', fontSize: '12px', marginLeft: '22px' }}>
                    ✉️ {params.data.user}@company.com
                  </div>
                </div>
              ),
            },
            {
              headerName: "🕒 Status & Schedule",
              field: "status",
              flex: 1.5,
              minWidth: 200,
              cellRenderer: (params) => (
                <div style={{ padding: '8px 0' }}>
                  <div style={{ 
                    color: params.data.status === "Finished" ? "green" : "red",
                    fontWeight: "bold",
                    marginBottom: '4px'
                  }}>
                    {params.data.status === "Finished" ? "✅" : "⏳"} {params.data.status.toUpperCase()}
                  </div>
                  <div style={{ color: '#666', fontSize: '11px' }}>
                    📅 Created: {params.data.created}
                  </div>
                  <div style={{ color: '#666', fontSize: '11px' }}>
                    ⚡ Processing Time: Fast
                  </div>
                </div>
              ),
            },
            {
              headerName: "⚡ Actions",
              field: "actions",
              flex: 0.8,
              minWidth: 120,
              maxWidth: 150,
              cellRenderer: (params) => (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '100%',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => onCellClicked({colDef: {field: 'details'}, data: params.data})}
                    style={{
                      backgroundColor: '#4F80FF',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#3A6BFF'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4F80FF'}
                  >
                    <FaEye size={12} />
                    View
                  </button>
                </div>
              ),
            },        
        ]);  
        
        const defaultColDef = {
            flex: 1,
        };
    
      // Container: Defines the grid's theme & dimensions.
      return (
          <>
              <div style={{ padding: '24px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                  {/* Header Section - Matching Warehouse Management Style */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            backgroundColor: '#4F80FF',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '20px'
                          }}>
                            📦
                          </div>
                          <div>
                              <h1 style={{ 
                                fontSize: '24px', 
                                fontWeight: '600', 
                                margin: '0 0 4px 0',
                                color: '#333'
                              }}>
                                Batch Management
                              </h1>
                              <p style={{ 
                                color: '#666', 
                                margin: '0',
                                fontSize: '14px'
                              }}>
                                Managing {batchCount} batches across your network
                              </p>
                          </div>
                      </div>
                      <Button 
                        style={{
                          backgroundColor: '#4F80FF',
                          color: 'white',
                          border: 'none',
                          padding: '12px 20px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onClick={e => {
                            setShowPopup(true);
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#3A6BFF'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#4F80FF'}
                      >
                          ➕ Add New Batch
                      </Button>
                  </div>

                  {/* Filter Section */}
                  <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr auto auto',
                      gap: '16px',
                      alignItems: 'end'
                    }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '4px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          color: '#666',
                          textTransform: 'uppercase'
                        }}>
                          CREATE DATE FROM
                        </label>
                        <input
                          type="date"
                          value={filters.createDateFrom}
                          onChange={(e) => handleFilterChange('createDateFrom', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: '#f8f9fa'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '4px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          color: '#666',
                          textTransform: 'uppercase'
                        }}>
                          CREATE DATE TO
                        </label>
                        <input
                          type="date"
                          value={filters.createDateTo}
                          onChange={(e) => handleFilterChange('createDateTo', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: '#f8f9fa'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '4px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          color: '#666',
                          textTransform: 'uppercase'
                        }}>
                          STATUS
                        </label>
                        <select
                          value={filters.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: '#f8f9fa'
                          }}
                        >
                          <option value="All">All</option>
                          <option value="Finished">Finished</option>
                          <option value="Processing">Processing</option>
                          <option value="Failed">Failed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      <button
                        onClick={clearFilters}
                        style={{
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textTransform: 'uppercase'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
                      >
                        Clear Filter
                      </button>

                      <button
                        onClick={applyFilters}
                        style={{
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textTransform: 'uppercase'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
                      >
                        Apply Filter
                      </button>
                    </div>
                  </div>
                  

                  {/* Main Grid Container */}
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    width: '100%',
                    minWidth: '1000px'
                  }}>
                      <div className="ag-theme-quartz" style={{ 
                        height: "500px", 
                        width: "100%",
                        minWidth: '100%'
                      }}>
                          <AgGridReact
                              ref={gridRef}
                              theme={myTheme}
                              rowData={filteredRowData}
                              columnDefs={colDefs}
                              rowHeight={80}          
                              alwaysShowHorizontalScroll={false}
                              onGridReady = {onGridReady}
                              onCellClicked={onCellClicked}
                              pagination={true}
                              paginationPageSize={10}
                              defaultColDef={{
                                  resizable: true,
                                  flex: 1,
                                  minWidth: 150
                              }}
                              headerHeight={50}
                              suppressRowHoverHighlight={false}
                              suppressHorizontalScroll={false}
                              domLayout={'normal'}
                          />
                      </div>
                  </div>
              </div>

              <NewBatchPopup
                  isOpen={showPopup}
                  onClose={() => setShowPopup(false)}
                  onSuccess={handleSuccess}
              />
          </>
      );
     
     };