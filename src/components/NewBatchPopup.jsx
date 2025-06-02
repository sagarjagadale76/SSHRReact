import React, { useState,state,useRef, useEffect } from "react";
import "./NewBatchPopup.css";
import  ReactDOM  from "react-dom/client";
import ShippingDetails from "./ShippingDetails";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from 'xlsx';


const root = ReactDOM.createRoot(document.getElementById("root"));


const NewBatchPopup = ({ isOpen, onClose, onSuccess }) => {  
  const [shippers, setShippers] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const fileInputRef = useRef(null);

  // Mock shipper data - replace with your actual API call
  useEffect(() => {
    if (isOpen) {
      fetchShippers();
    }
  }, [isOpen]);

  const fetchShippers = async () => {
    try {
      axios(
        {
            method: "GET",
            url: "https://7uwv62mcpb.execute-api.eu-west-2.amazonaws.com/dev/shipperconfig",
            headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
        }            
    ).then(response => {
      
     const results = [];
      // Store results in the results array
      response.data.forEach((value) => {
        results.push({
          ShipperAccountCode: value.ShipperAccountCode,
          ShipperName: value.ShipperName,
        });
      });

        // Update the options state
      setShippers(results);       
    });
    } catch (error) {
      setError('Failed to fetch shipper data');
    }
  };

  // Helper function to determine content type based on file
  const getContentType = (file) => {
    if (file.type === 'text/csv') {
      return 'text/csv';
    } else if (file.type === 'application/vnd.ms-excel') {
      return 'application/vnd.ms-excel';
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else {
      // Fallback based on file extension
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.csv')) {
        return 'text/csv';
      } else if (fileName.endsWith('.xls')) {
        return 'application/vnd.ms-excel';
      } else if (fileName.endsWith('.xlsx')) {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }
      return 'application/octet-stream'; // Default fallback
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setError('');
    
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    const fileName = selectedFile.name.toLowerCase();
    const isValidExtension = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');
    const isValidMimeType = allowedTypes.includes(selectedFile.type);
    
    if (!isValidMimeType && !isValidExtension) {
      setError('Please select a valid Excel (.xlsx, .xls) or CSV file');
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    previewFile(selectedFile);
  };

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Handle escaped quotes
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current.trim());
    return result;
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
          // Handle CSV files
          const csvData = e.target.result;
          // Normalize line endings - handle both \r\n and \n
          const normalizedData = csvData.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
          const lines = normalizedData.split('\n').filter(line => line.trim());
          setRowCount(lines.length);
          
          // Create preview data (first 5 rows) using proper CSV parsing
          const preview = lines.slice(0, Math.min(5, lines.length)).map(line => {
            return parseCSVLine(line);
          });
          setPreviewData(preview);
        } else {
          // Handle Excel files
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Get row count
          const range = XLSX.utils.decode_range(worksheet['!ref']);
          const totalRows = range.e.r + 1;
          setRowCount(totalRows);
          
          // Convert to JSON for preview (first 5 rows)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const preview = jsonData.slice(0, Math.min(5, jsonData.length));
          setPreviewData(preview);
        }
      } catch (error) {
        setError('Error reading file. Please ensure it\'s a valid file.');
      }
    };
    
    if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const addShipperAccountCodeColumn = (workbook, sheetName, shipperAccountCode) => {
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Find the next available column
    const newColumnIndex = range.e.c + 1;
    const newColumnLetter = XLSX.utils.encode_col(newColumnIndex);
    
    // Add header in row 1
    const headerCell = `${newColumnLetter}1`;
    worksheet[headerCell] = { t: 's', v: 'ShipperAccountCode' };
    
    // Add the selected shipper's account code to ALL data rows (starting from row 2)
    for (let row = 2; row <= range.e.r + 1; row++) {
      const dataCell = `${newColumnLetter}${row}`;
      worksheet[dataCell] = { t: 's', v: shipperAccountCode };
    }
    
    // Update the worksheet range to include the new column
    const newRange = XLSX.utils.encode_range({
      s: { c: range.s.c, r: range.s.r },
      e: { c: newColumnIndex, r: range.e.r }
    });
    worksheet['!ref'] = newRange;
    
    console.log(`Added ShipperAccountCode column with value "${shipperAccountCode}" to ${range.e.r} rows`);
    
    return workbook;
  };

  const addShipperAccountCodeToCSV = (csvContent, shipperAccountCode) => {
    // Normalize line endings first - handle \r\n, \r, and \n
    const normalizedContent = csvContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedContent.split('\n');
    const modifiedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip completely empty lines
      if (line.trim() === '') {
        if (i === lines.length - 1) {
          // Don't add empty line at the very end
          continue;
        }
        modifiedLines.push(line);
        continue;
      }
      
      if (i === 0) {
        // Header row - add ShipperAccountCode column
        const cleanLine = line.trim();
        modifiedLines.push(cleanLine + ',ShipperAccountCode');
      } else {
        // Data rows - add the shipper account code value
        const cleanLine = line.trim();
        if (cleanLine) { // Only process non-empty lines
          modifiedLines.push(cleanLine + ',' + shipperAccountCode);
        }
      }
    }
    
    // Join with consistent line endings (\n) and ensure file ends with a single newline
    const result = modifiedLines.join('\n') + '\n';
    
    console.log('CSV Processing Debug:');
    console.log('Original lines count:', lines.length);
    console.log('Modified lines count:', modifiedLines.length);
    console.log('Original first line:', JSON.stringify(lines[0]));
    console.log('Modified first line:', JSON.stringify(modifiedLines[0]));
    if (lines.length > 1) {
      console.log('Original second line:', JSON.stringify(lines[1]));
      console.log('Modified second line:', JSON.stringify(modifiedLines[1]));
    }
    
    return result;
  };

  const getSignedUrl = async (fileName) => {
    try {
      const response = await fetch(
        `https://3tv7s8t8tj.execute-api.eu-west-2.amazonaws.com/dev/signedurl?fileName=${fileName}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': 'TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }
      
      const data = await response.json();
      return data.uploadUrl;
    } catch (error) {
      throw new Error('Failed to get upload URL');
    }
  };

  const uploadToS3 = async (signedUrl, modifiedFile, contentType) => {
    try {
      const response = await fetch(signedUrl, {
        method: 'PUT',
        body: modifiedFile,
        headers: {
          'Content-Type': contentType
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file to S3');
      }
      
      return true;
    } catch (error) {
      throw new Error('Upload failed');
    }
  };

  const saveBatchRecord = async (fileName, shipperDetails) => {
    const batchData = {
      BatchId: -1,
      FileName: fileName,
      Status: 'InProgress',
      Parcels: (rowCount - 1).toString(),
      ShipperName: shipperDetails.ShipperName,
      ShipperAccountCode: shipperDetails.ShipperAccountCode    
    };

    debugger;

    try {
      const response = await fetch(
        'https://35kkdepo1j.execute-api.eu-west-2.amazonaws.com/dev/batches',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu'
          },
          body: JSON.stringify(batchData)
        }
      );
      
      debugger;
      if (!response.ok) {
        throw new Error('Failed to save batch record');
      }
      
      return true;
    } catch (error) {
      throw new Error('Failed to save batch record');
    }
  };

  const handleUpload = async () => {
    debugger;
    if (!file || !selectedShipper) {
      setError('Please select a file and shipper');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setUploadStatus('Preparing file...');

    try {
      const shipperDetails = shippers.find(s => s.ShipperAccountCode === selectedShipper);
      
      if (!shipperDetails) {
        throw new Error('Invalid shipper selection');
      }

      setUploadStatus('Adding ShipperAccountCode column...');
      setUploadProgress(20);
      
      const reader = new FileReader();
      const isCSV = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
      const contentType = getContentType(file);
      
      reader.onload = async (e) => {
        try {
          let modifiedFile;
          
          if (isCSV) {
            // Handle CSV files
            const csvContent = e.target.result;
            const modifiedCSV = addShipperAccountCodeToCSV(csvContent, shipperDetails.ShipperAccountCode);
            modifiedFile = new Blob([modifiedCSV], { type: 'text/csv' });
          } else {
            // Handle Excel files
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            
            const modifiedWorkbook = addShipperAccountCodeColumn(
              workbook, 
              firstSheetName, 
              shipperDetails.ShipperAccountCode
            );
            
            const modifiedBuffer = XLSX.write(modifiedWorkbook, { 
              bookType: 'xlsx', 
              type: 'array' 
            });
            modifiedFile = new Blob([modifiedBuffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
          }
          
          setUploadStatus('Getting upload URL...');
          setUploadProgress(40);
          
          const signedUrl = await getSignedUrl(file.name);
          
          setUploadStatus('Uploading to S3...');
          setUploadProgress(60);
          
          await uploadToS3(signedUrl, modifiedFile, contentType);
          
          setUploadStatus('Saving batch record...');
          setUploadProgress(80);
          
          await saveBatchRecord(file.name, shipperDetails);
          
          setUploadProgress(100);
          setUploadStatus('Upload completed successfully!');
          
          setTimeout(() => {
            onSuccess && onSuccess();
            handleClose();
          }, 1500);
          
        } catch (error) {
          setError(error.message || 'Upload failed');
          setIsUploading(false);
          setUploadStatus('');
        }
      };
      
      if (isCSV) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
      
    } catch (error) {
      setError(error.message || 'Upload failed');
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    
    setFile(null);
    setSelectedShipper('');
    setPreviewData(null);
    setRowCount(0);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatus('');
    setError('');
    setShowPreview(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    onClose && onClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleShipper = (e) => {
    debugger;
    setSelectedShipper(e.target.value);
   
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">New Batch Upload</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Shipper Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Shipper <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedShipper}
                onChange={(e) =>  handleShipper(e)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isUploading}
              >
                <option value="">Choose a shipper...</option>
                {shippers.map((shipper) => (
                  <option key={shipper.ShipperAccountCode} value={shipper.ShipperAccountCode}>
                    {shipper.ShipperAccountCode} - {shipper.ShipperName}
                  </option>
                ))}
              </select>
            </div>

            {/* File Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                Excel (.xlsx, .xls) / CSV
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File <span className="text-red-500">*</span>
            </label>
            <div 
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                file 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              
              {file ? (
                <div className="text-green-600">
                  <div className="text-xl mb-2">📄</div>
                  <div className="text-lg font-semibold">{file.name}</div>
                  <div className="text-sm text-gray-600">
                    Size: {(file.size / 1024).toFixed(1)} KB • Rows: {rowCount}
                  </div>
                  {previewData && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPreview(!showPreview);
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">
                  <div className="text-4xl mb-2">📁</div>
                  <div className="text-lg font-semibold">Click to upload file</div>
                  <div className="text-sm">Supports Excel (.xlsx, .xls) and CSV files up to 10MB</div>
                </div>
              )}
            </div>
          </div>

          {/* File Preview */}
          {previewData && showPreview && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">File Preview</h3>
              <div className="overflow-x-auto border rounded-lg max-h-64">
                <table className="min-w-full bg-white text-sm">
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}>
                        {row.map((cell, cellIndex) => (
                          <td 
                            key={cellIndex} 
                            className="px-3 py-2 border-b text-gray-700 whitespace-nowrap"
                          >
                            {cell || ''}
                          </td>
                        ))}
                        {rowIndex === 0 && (
                          <td className="px-3 py-2 border-b font-semibold text-blue-600 bg-blue-50 whitespace-nowrap">
                            ShipperAccountCode
                          </td>
                        )}
                        {rowIndex > 0 && (
                          <td className="px-3 py-2 border-b text-gray-500 bg-blue-50 whitespace-nowrap">
                            {selectedShipper ? shippers.find(s => s.ShipperAccountCode === selectedShipper)?.ShipperAccountCode : 'Select shipper first'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Showing first 5 rows • Total rows: {rowCount} • ShipperAccountCode "{selectedShipper ? shippers.find(s => s.ShipperAccountCode === selectedShipper)?.ShipperAccountCode : 'N/A'}" will be added to all {rowCount - 1} data rows
              </p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  {uploadStatus}
                </span>
                <span className="font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || !selectedShipper || isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Uploading...
              </>
            ) : (
              <>
                <span>📤</span>
                Save Batch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
  };
  
  export default  NewBatchPopup;