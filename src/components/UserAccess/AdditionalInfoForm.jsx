"use client"

import { useState,useEffect,useCallback } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios";

const AdditionalInfoForm = ({ formData, handleInputChange, handleToggleChange, prevStep, nextStep }) => {
  // const timezones = [
  //   "UTC-12:00",
  //   "UTC-11:00",
  //   "UTC-10:00",
  //   "UTC-09:00",
  //   "UTC-08:00",
  //   "UTC-07:00",
  //   "UTC-06:00",
  //   "UTC-05:00",
  //   "UTC-04:00",
  //   "UTC-03:00",
  //   "UTC-02:00",
  //   "UTC-01:00",
  //   "UTC+00:00",
  //   "UTC+01:00",
  //   "UTC+02:00",
  //   "UTC+03:00",
  //   "UTC+04:00",
  //   "UTC+05:00",
  //   "UTC+06:00",
  //   "UTC+07:00",
  //   "UTC+08:00",
  //   "UTC+09:00",
  //   "UTC+10:00",
  //   "UTC+11:00",
  //   "UTC+12:00",
  // ]

  const [timezones, setTimezones] = useState([]);
  const [warehouses, setWareHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const location = useLocation();

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR"]
  const labelTypes = ["System Label", "Custom Label", "Thermal Label", "Standard Label"]
  const dimensionUnits = ["Centimeter", "Inch", "Meter"]
  const weightUnits = ["Kilogram", "Pound", "Gram", "Ounce"]
  const geocodeProviders = ["none", "Google Maps", "MapBox", "HERE Maps", "OpenStreetMap"]

  const ToggleSwitch = ({ label, checked, onChange, description }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )

  const validateForm = () => {
    const newErrors = {}

    if (!formData.ClientAccountCode.trim()) {
      newErrors.ClientAccountCode = "ClientAccountCode is required"
    }

    if (!formData.WareHouse.trim()) {
      newErrors.WareHouse = "WareHouse is required"
    }  
    
    if (!formData.LabelType.trim()) {
      newErrors.LabelType = "LabelType is required"
    } 

    if (!formData.DimensionUnits.trim()) {
      newErrors.DimensionUnits = "DimensionUnits is required"
    } 
  
    if (!formData.WeightUnits.trim()) {
      newErrors.WeightUnits = "WeightUnits is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

    useEffect(() => {
        if ((location.pathname === '/settings/manage-access/create' || location.pathname === '/settings/manage-access/edit')) {
          debugger;    
          fetchTimezones();
          fetchWareHouses();
        }
      }, []);
  
   const fetchTimezones = useCallback(() => {
         setLoading(true);
         setErrors(null);
         
         try {
           axios({
         method: "GET",
         url: "https://jbzaljscw8.execute-api.eu-west-2.amazonaws.com/dev/timezones",
         headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
       })
         .then((response) => {
           const results = response.data.map((value) => ({
             Id: value.Id,
             Name: value.Name,
             Value: value.Value          
           }))
   
           setTimezones(results);  
           setLoading(false);
   
         })
         } catch (err) {
           setErrors(err.message);
           console.error('Error fetching timezones:', err);
           
           // Fallback timezone data
           const fallbackTimezones = [
             { value: 'America/New_York', label: 'America / New York (EST)' },
             { value: 'America/Chicago', label: 'America / Chicago (CST)' },
             { value: 'America/Denver', label: 'America / Denver (MST)' },
             { value: 'America/Los_Angeles', label: 'America / Los Angeles (PST)' },
             { value: 'Europe/London', label: 'Europe / London (GMT)' },
             { value: 'Europe/Paris', label: 'Europe / Paris (CET)' },
             { value: 'Asia/Tokyo', label: 'Asia / Tokyo (JST)' },
             { value: 'Asia/Shanghai', label: 'Asia / Shanghai (CST)' },
             { value: 'Australia/Sydney', label: 'Australia / Sydney (AEST)' },
             { value: 'UTC', label: 'UTC (Coordinated Universal Time)' }
           ];
           setTimezones(fallbackTimezones);
         } finally {
           
         }
       }, null);

   const fetchWareHouses = useCallback(() => {
       setLoading(true)
       setErrors(null)
   
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
   
           setWareHouses(results)
           setLoading(false)
         })
         .catch((err) => {
           setErrors("Failed to load warehouse data. Please try again.")
           setLoading(false)
           console.error("Error fetching warehouse data:", err)
         })
     }, []);

    const handleNext = (e) => {
    
    e.preventDefault()
    if (validateForm()) {
      nextStep()
    }
    
  }

  return (
    <form onSubmit={handleNext} className="space-y-6">
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Additional Information</h2>

      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WareHouse</label>
          <select
            name="WareHouse"
            value={formData.WareHouse}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors?.WareHouse ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">
                    {loading ? 'Loading warehouses...' : 'Select Warehouse'}
                  </option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.Id} value={warehouse.Title}>
                      {warehouse.Title} ({warehouse.Value})
                    </option>
                  ))}
          </select>
          {errors?.WareHouse && <p className="mt-1 text-sm text-red-500">{errors?.WareHouse}</p>}
        </div>

      {/* Basic Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Number</label>
          <input
            type="text"
            name="ClientAccountCode"
            value={formData.ClientAccountCode}
            onChange={handleInputChange}
            placeholder="SSN001"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors?.ClientAccountCode ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors?.ClientAccountCode && <p className="mt-1 text-sm text-red-500">{errors?.ClientAccountCode}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <select
            name="Timezone"
            value={formData.Timezone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
                    {loading ? 'Loading timezones...' : 'Select Timezone'}
                  </option>
                  {timezones.map((timezone) => (
                    <option key={timezone.Id} value={timezone.Name}>
                      {timezone.Name} ({timezone.Value})
                    </option>
                  ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            name="Currency"
            value={formData.Currency}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <input
            type="text"
            name="ApiKey"
            value={formData.ApiKey}
            onChange={handleInputChange}
            placeholder="b446b3e74f9478ebc42696c85f80a75a"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Label and Units Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label Type</label>
          <select
            name="LabelType"
            value={formData.LabelType}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors?.LabelType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Label Type</option>
            {labelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors?.LabelType && <p className="mt-1 text-sm text-red-500">{errors?.LabelType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dimension Units</label>
          <select
            name="DimensionUnits"
            value={formData.DimensionUnits}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors?.DimensionUnits ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Units</option>
            {dimensionUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors?.DimensionUnits && <p className="mt-1 text-sm text-red-500">{errors?.DimensionUnits}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight Units</label>
          <select
            name="WeightUnits"
            value={formData.WeightUnits}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors?.WeightUnits ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Units</option>
            {weightUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors?.WeightUnits && <p className="mt-1 text-sm text-red-500">{errors?.WeightUnits}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Geocode Service Provider</label>
        <select
          name="GeoCodeServiceProvider"
          value={formData.GeoCodeServiceProvider}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Provider</option>
          {geocodeProviders.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
      </div>

      {/* Email and Weight Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Notification Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSwitch
            label="Enable Consignee Emails Notification"
            checked={formData.EnableConsigneeEmails}
            onChange={() => handleToggleChange("EnableConsigneeEmails")}
            description="Send email notifications to consignees"
          />
          <ToggleSwitch
            label="Enable Push Back Chargeable Weight"
            checked={formData.EnablePushBackChargeableWeight}
            onChange={() => handleToggleChange("EnablePushBackChargeableWeight")}
            description="Automatically calculate chargeable weight"
          />
        </div>
      </div>

      {/* SHIPPER FTP ACCOUNT */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Shipper FTP Account</h3>
        <ToggleSwitch
          label="Enable SFTP"
          checked={formData.EnableSFTP}
          onChange={() => handleToggleChange("EnableSFTP")}
          description="Enable secure file transfer protocol"
        />
      </div>

      {/* HURRICANE INTEGRATION */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Hurricane Integration</h3>
        <ToggleSwitch
          label="Enable Hurricane"
          checked={formData.EnableHurricane}
          onChange={() => handleToggleChange("EnableHurricane")}
          description="Enable Hurricane weather tracking integration"
        />
      </div>

      {/* PARCEL PROCESSING */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Parcel Processing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSwitch
            label="Enable Label Suppression"
            checked={formData.EnableLabelSuppression}
            onChange={() => handleToggleChange("EnableLabelSuppression")}
            description="Suppress label printing for certain shipments"
          />
          <ToggleSwitch
            label="Enable Auto-Accept"
            checked={formData.EnableAutoAccept}
            onChange={() => handleToggleChange("EnableAutoAccept")}
            description="Automatically accept shipment confirmations"
          />
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
        <textarea
          name="AdditionalInfo"
          value={formData.AdditionalInfo}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any additional information or special requirements..."
        ></textarea>
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
          type="submit"          
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
    </form>
  )
}

export default AdditionalInfoForm
