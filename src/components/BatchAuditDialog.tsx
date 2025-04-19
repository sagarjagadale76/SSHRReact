
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Download, RotateCcw } from 'lucide-react'
import * as React from 'react';
import {useNavigate, useLocation } from "react-router-dom";




export default function BatchAuditDialog() {
  let location = useLocation(); 
  let navigate = useNavigate();
  //const [isOpen, setIsOpen] = useState(false);
  debugger;   
  const data = location.state.data;
    const onClose=() =>{
      navigate('/batches'); 
    };
  return (
    <Dialog open={location.state.isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-gray-700">
            View #{data.id}
          </DialogTitle>
          <div className="flex items-center gap-2 text-teal-500 text-sm">
            <RotateCcw className="h-5 w-5" />
            <span>Batch audit</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-[120px,1fr] gap-4">
            <div className="font-medium text-gray-700">Created</div>
            <div className="text-gray-700">{data.created}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] gap-4">
            <div className="font-medium text-gray-700">User</div>
            <div className="text-gray-700">{data.user}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] gap-4">
            <div className="font-medium text-gray-700">Type</div>
            <div className="text-gray-700">{data.type}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] gap-4">
            <div className="font-medium text-gray-700">Status</div>
            <div className="text-gray-700">{data.status}</div>
          </div>

          <div className="grid grid-cols-[120px,1fr] gap-4">
            <div className="font-medium text-gray-700">Parcels</div>
            <div className="space-y-1">
              <div className="text-teal-500 hover:underline cursor-pointer">
                {data.parcelsFound} - found
              </div>
              <div className="text-teal-500 hover:underline cursor-pointer">
                {data.parcelsCreated} - created
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[120px,1fr] gap-4">
            <div className="font-medium text-gray-700">File</div>
            <div className="text-teal-500 hover:underline cursor-pointer flex items-center gap-1">
              <Download className="h-4 w-4" />
              {data.fileName}
            </div>
          </div>

          <div className="grid grid-cols-[120px,1fr] gap-4">
            <div className="font-medium text-gray-700">Labels</div>
            <div className="text-teal-500 hover:underline cursor-pointer flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-8 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            CANCEL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

