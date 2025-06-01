"use client"

import { useState,useEffect,useCallback } from "react"
import axios from "axios";

const PermissionsForm = ({ formData, handlePermissionChange, prevStep, handleSubmit }) => {
const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // const permissions = [
  //   { id: "View-Dash", label: "Access to dashboard" },
  //   { id: "UsersManageAccess", label: "Users | Manage access" },
  //   { id: "Warehouses", label: "Warehouses" },
  //   { id: "View-Parcel", label: "Access to Parcels Function" },
  //   { id: "trackingMapping", label: "Tracking mapping" },
  //   { id: "carrierErrorMapping", label: "Carrier error mapping" },
  //   { id: "trackingUrls", label: "Tracking urls" },
  //   { id: "consigneeEmails", label: "Consignee emails" },
  //   { id: "validationRules", label: "Validation rules" },
  //   { id: "permissions", label: "Permissions" },
  //   { id: "tiers", label: "Tiers" },
  //   { id: "dwsSortingRules", label: "DWS Sorting rules" },
  //   { id: "crates", label: "Crates" },
  //   { id: "parcelTracking", label: "Parcel tracking" },
  //   { id: "requestLogs", label: "Request logs" },
  //   { id: "dwsImages", label: "DWS Images" },
  //   { id: "opsReport", label: "Ops report" },
  //   { id: "brokerRules", label: "Broker rules" },

  // ]

useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = useCallback(() => {  
    
         setLoading(true);
         setError(null);
           
           try {
             axios({
           method: "GET",
           url: "https://j34183xbc8.execute-api.eu-west-2.amazonaws.com/dev/userpermissions",
           headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
         })
           .then((response) => {
             const results = response.data.map((value) => ({
               id: value.PermissionCode,
               label: value.PermissionDescription                        
             }))
     
             setPermissions(results);  
             setLoading(false);
     
           })
           } catch (err) {
             setError(err.message);
             console.error('Error fetching permissions:', err);             
             
           } finally {
             
           }
         }, null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Edit permissions</h2>
        <p className="text-sm text-gray-600 mt-1">{formData.FullName}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wider">TITLE</span>
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wider">ACTIVE</span>
          </div>
        </div>

        {/* Permissions List */}
        <div className="divide-y divide-gray-200">
          {permissions.map((permission, index) => (
            <div key={permission.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{permission.label}</span>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={formData.Permissions.includes(permission.id)}
                    onChange={() => handlePermissionChange(permission.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Save permissions
        </button>
      </div>
    </div>
  )
}

export default PermissionsForm
