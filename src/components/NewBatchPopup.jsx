import React, { useState,state,useRef, useEffect } from "react";
import "./NewBatchPopup.css";
import  ReactDOM  from "react-dom/client";
import ShippingDetails from "./ShippingDetails";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from 'xlsx';

const root = ReactDOM.createRoot(document.getElementById("root"));


const NewBatchPopup = () => {  
  let navigate = useNavigate();
  const location = useLocation();
  const [options, setOptions] = useState([]);//Dropdown Values
    const [isOpen, setIsOpen] = useState(true); // Popup visibility state
    const [file, setFile] = useState([]);
    const myElementRef = useRef(null);
    const [rowCount, setRowCount] = useState(0);

    const shipperData = {
      BatchId: undefined,
      FileName: undefined,
      Status: undefined,
      Parcels: undefined,
      ShipperName : undefined
    };
    
  
    const uploadFile = (e) => {


      
      // Getting the signed url
      axios(
          {
              method: "GET",
              url: "https://3tv7s8t8tj.execute-api.eu-west-2.amazonaws.com/dev/signedurl?fileName=" +
              file.name,
              headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
          }            
      ).then(response => {
          // Getting the url from response
          const url = response.data.uploadUrl;

          axios({
              method: "PUT",
              url: url,
              data: file,
              headers: { "Content-Type": "multipart/form-data" }
          })
              .then(res => {
                                
              })
              .catch(err => {
                
              });
      });     
  }

    const togglePopup = (path) => {
      setIsOpen(!isOpen);
      
    };
    
   
    const fetchData =() => {
      // Fetch data
            
      axios(
        {
            method: "GET",
            url: "https://7uwv62mcpb.execute-api.eu-west-2.amazonaws.com/dev/shipper",
            headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
        }            
    ).then(response => {
      
     const results = [];
      // Store results in the results array
      response.data.forEach((value) => {
        results.push({
          key: value.ShipperName,
          value: value.ShipperName,
        });
      });

        // Update the options state
      setOptions([
        {key: 'Select a company', value: ''}, 
        ...results
      ])       
    });
      
      
    };

    const saveBatch =(fileName) =>{
        shipperData.ShipperName = document.getElementById("shipper").value;        
        shipperData.Status= "InProgress";
        shipperData.Parcels= rowCount.toString();
        debugger;
        shipperData.BatchId = location.state === -Infinity ? 1 : location.state + 1;
        shipperData.FileName = fileName;

      axios(
        {
            method: "POST",
            url: "https://35kkdepo1j.execute-api.eu-west-2.amazonaws.com/dev/batches",
            headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
            data: shipperData
        }            
    ).then(response => {
      
      navigate('/batches'); 
     
    });

    };

    const uploadAndSaveBatch =(e) =>{
      uploadFile(e);
      saveBatch(file.name);
    };

    const redirectToBatch = () => {
      navigate('/batches');
    };

    const selectToUploadFile = (e)=>{
      setFile(e.target.files[0]);
      const reader = new FileReader();      
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        debugger;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        setRowCount(range.e.r + 1); 
       addNewColumn(workbook, firstSheetName, 'BatchId', location.state + 1);
      };

      reader.readAsArrayBuffer(e.target.files[0]);
      
    };

    function addNewColumn(workbook, sheetName, newColumnName, newColumnValue) {
      const worksheet = workbook.Sheets[sheetName];
    
      // Find the last column index
      let lastColumnIndex = 0;
      Object.keys(worksheet).forEach((cellAddress) => {        
        const cell = worksheet[cellAddress];
        console.log(cellAddress);
        if (cell.t !== 'z' && cellAddress !=='!ref') { // Ignore empty cells
          const columnNumber = cellAddress.match(/\d+/)[0];
          lastColumnIndex = Math.max(lastColumnIndex, parseInt(columnNumber, 10));
        }
      });
    
      debugger;
      // Add the new column
      const newColumnIndex = lastColumnIndex + 1;
      worksheet[XLSX.utils.encode_cell({ c: newColumnIndex, r: 0 })] = { t: 's' , v: newColumnName };
      
      return workbook;
    }

    fetchData();

    const handleClick = () => {
      // Trigger the change event on the input
      myElementRef.current.click();
    };
  
    return (
      isOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h2 className="header">New Batch</h2>
            <div className="form-group">
            <div className="shipperDiv">
              <view className="labelContainer">
              <label>Shipper</label> 
              </view>
              <view>          
              <select id="shipper">
              {options.map((option) => {
                
          return (
            <option key={option.value} value={option.value}>
              {option.key}
            </option>
          );
        })}
              </select>
              </view> 
              </div >
              <div className="typeDiv">
              <view className="labelContainer">              
              <label>Type</label>
              </view>
              <view>               
              <select id="fileType">
                <option value="1">CSV</option>
                <option value="2">Custom</option>
                {/* Add options here */}
              </select>
              </view>
              </div>
            </div>            
            <div className="upload-area">
            <input
                                type="file"                               
                                id="fileUpload"
                                ref={myElementRef}
                                className="inputButton"
                                onChange={selectToUploadFile}
                            ></input>
                            <p onClick={handleClick}>Upload File</p> 
                                       
            </div>
            <div className="buttons">
              <button className="cancel-btn" onClick={redirectToBatch}>
                Cancel
              </button>
              <button className="save-btn" onClick={uploadAndSaveBatch}>Save Batch</button>
            </div>
          </div>
        </div>
      )
    );
  };
  
  export default  NewBatchPopup;