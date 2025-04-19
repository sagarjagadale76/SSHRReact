import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Download, RotateCcw } from 'lucide-react';
import React, { Component, useState,useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import  ReactDOM  from "react-dom/client";
import "./ViewBatchPopup.css";

//const root = ReactDOM.createRoot(document.getElementById("root"));



export default class ViewBatchPopup extends React.Component {

  render() {
    return (          
            
        <div>
        <PopupData/>                
        </div>
        
      );
    }

  
};


const PopupData = () => {
  debugger;
  const location = useLocation();
  const [data, setData] = useState({
    id: null,
    created : "",
    user: "",
    type: "",
    status:  "",
    parcelsFound: 0,
    parcelsCreated: 0,
    fileName:  ""
  });

  const [isOpen, setIsOpen] = useState(false);
  

  const onClose = () =>{
    setIsOpen(false);
  };

  const getBatchData = useCallback(() =>{
    axios(
      {
          method: "GET",
          url: "https://35kkdepo1j.execute-api.eu-west-2.amazonaws.com/dev/batches?batchId=" + location.state.batchId,
          headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
      }            
  ).then(response => {          
    const results = [];

    setData((prevState) => ({
      ...prevState,
      id : response.data.BatchId,
      created : response.data.CreatedDate,
      user: response.data.ShipperName,
      type: "default",
      status:  response.data.Status,
      parcelsFound: response.data.Parcels,
      parcelsCreated: response.data.Parcels,
      fileName:  response.data.FileName
   }));
                          
  });  

  },{
    id: null,
    created : "",
    user: "",
    type: "",
    status:  "",
    parcelsFound: 0,
    parcelsCreated: 0,
    fileName:  ""
  });

 

  return (
    <Dialog open={location.state.isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl batch-audit-dialog">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            View #{data.id}
          </DialogTitle>
          <div className="batch-audit-label">
            <RotateCcw className="h-5 w-5" />
            <span>Batch audit</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid-layout">
            <div className="label">Created</div>
            <div className="value">{data.created}</div>
          </div>

          <div className="grid-layout">
            <div className="label">User</div>
            <div className="value">{data.user}</div>
          </div>

          <div className="grid-layout">
            <div className="label">Type</div>
            <div className="value">{data.type}</div>
          </div>

          <div className="grid-layout">
            <div className="label">Status</div>
            <div className="value">{data.status}</div>
          </div>

          <div className="grid-layout">
            <div className="label">Parcels</div>
            <div className="space-y-1">
              <div className="link">
                {data.parcelsFound} - found
              </div>
              <div className="link">
                {data.parcelsCreated} - created
              </div>
            </div>
          </div>

          <div className="grid-layout">
            <div className="label">File</div>
            <div className="link flex items-center gap-1">
              <Download className="h-4 w-4" />
              {data.fileName}
            </div>
          </div>

          <div className="grid-layout">
            <div className="label">Labels</div>
            <div className="link flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <Button
            variant="secondary"
            onClick={onClose}
            className="cancel-button"
          >
            CANCEL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

};
  
 