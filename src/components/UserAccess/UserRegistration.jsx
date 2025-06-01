"use client"

import { useState,useCallback,useEffect } from "react"
import ProgressBar from "./ProgressBar"
import BasicInfoForm from "./BasicInfoForm"
import CompanyInfoForm from "./CompanyInfoForm"
import PermissionsForm from "./PermissionsForm"
import AdditionalInfoForm from "./AdditionalInfoForm"
import SuccessMessage from "./SuccessMessage"
import axios from "axios";
import { useLocation } from 'react-router-dom';

export default function UserRegistration() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    Id: -1, // Default value for new user
    FullName: "",
    Email: "",
    Role: "",
    Password: "",
    ConfirmPassword: "",
    // Company Information fields
    Address1: "",
    Address2: "",
    Address3: "",
    City: "",
    State: "",
    Zip: "",
    Country: "",
    Phone: "",
    CompanyEmail: "",
    Vat: "",
    Eori: "",
    Ioss: "",
    Aen: "",
    Abn: "",
    Grt: "",
    TaxId: "",
    // Updated permissions array to match the new permission structure
    Permissions: [],
    UserPermissions:"",
    AdditionalInfo: "",
    // Additional Information fields
    WareHouse:"",
    ClientAccountCode: "",
    Timezone: "",
    Currency: "",
    ApiKey: "",
    LabelType: "",
    DimensionUnits: "",
    WeightUnits: "",
    GeoCodeServiceProvider: "",
    EnableConsigneeEmails: false,
    EnablePushBackChargeableWeight: false,
    EnableSFTP: false,
    EnableHurricane: false,
    EnableLabelSuppression: false,
    EnableAutoAccept: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const Location = useLocation();
  debugger;

   const onLoadUsers = useCallback(() => {
      debugger;
     var userData = {
        "UserName": Location.state?.UserName || "",
      }
      axios(
        {
          method: "Post",
          url: "https://j34183xbc8.execute-api.eu-west-2.amazonaws.com/dev/getSystemUsers",
          headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
          data: userData
        }            
    )
    .then(response => { 
      debugger;
      const results = [];
      // Store results in the results array
      response.data.map((value) => {
         results.push({
          Id: value.Id,
          FullName: value.FullName,  
          Email: value.UserName,
          Role: value.Role,
          Address1: value.Shipper?.Address1,
          Address2: value.Shipper?.Address2,
          Address3: value.Shipper?.Address3,
          City: value.Shipper?.City,
          State: value.Shipper?.State,
          Zip: value.Shipper?.Zip,
          Country: value.Shipper?.Country,
          Phone: value.Shipper?.Phone,
          CompanyEmail: value.Shipper?.CompanyEmail,
          Vat:  value.Shipper?.Vat,
          Eori: value.Shipper?.Eori,
          Ioss: value.Shipper?.Ioss,
          Aen:  value.Shipper?.Aen,
          Abn:  value.Shipper?.Abn,
          Grt:  value.Shipper?.Grt,
          TaxId: value.Shipper?.TaxId,
          // Updated permissions array to match the new permission structure
          Permissions: value.UserPermissions ? value.UserPermissions.split(",") : [],
          UserPermissions: value.UserPermissions || "",
          AdditionalInfo: value.AdditionalInfo || "",
          // Additional Information fields
          WareHouse: value.Shipper?.WareHouse || "",
          ClientAccountCode: value.Shipper?.ClientAccountCode || "",
          Timezone: value.Shipper?.Timezone || "",
          Currency: value.Shipper?.Currency || "",
          ApiKey: value.Shipper?.ApiKey || "",
          LabelType: value.Shipper?.LabelType || "",
          DimensionUnits: value.Shipper?.DimensionUnits || "",
          WeightUnits: value.Shipper?.WeightUnits || "",
          GeoCodeServiceProvider: value.Shipper?.GeoCodeServiceProvider || "",
          EnableConsigneeEmails: value.Shipper?.EnableConsigneeEmails || false,
          EnablePushBackChargeableWeight: value.Shipper?.EnablePushBackChargeableWeight || false,
          EnableSFTP:   value.Shipper?.EnableSFTP || false,
          EnableHurricane: value.Shipper?.EnableHurricane || false,
          EnableLabelSuppression: value.Shipper?.EnableLabelSuppression || false,
          EnableAutoAccept: value.Shipper?.EnableAutoAccept || false
        });
  
        
        });

        setFormData(results[0]); 
      }); 
    }, null);
  
    useEffect(() => {
      if (window.location.pathname === "/settings/manage-access/edit") {
       
        onLoadUsers();
      }
    }, []);
  
   

  // Determine total steps based on Role
  const getTotalSteps = () => {
    debugger;
    if (formData.Role === "Administrator") {
      return 2 // Basic Info + Permissions only
    } else if (formData.Role === "Shipper") {
      return 4 // Basic Info + Company + Additional Info + Permissions
    }
    return 2 // Basic Info + Permissions only
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePermissionChange = (permission) => {
    const updatedPermissions = formData.Permissions.includes(permission)
      ? formData.Permissions.filter((p) => p !== permission)
      : [...formData.Permissions, permission]

    setFormData({ ...formData, Permissions: updatedPermissions })
  }

  const nextStep = () => {   
        setCurrentStep(currentStep + 1)   
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    debugger;
    // Here you would make your API call to save the data
    console.log("Submitting form data:", formData)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      submitUserAPI();
      
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const submitUserAPI = useCallback(() => {
    
    var userRequest= mapUserRequest(formData.Id);    
           
           try {
             axios({
           method: "Post",
           url: "https://j34183xbc8.execute-api.eu-west-2.amazonaws.com/dev/systemusers",
           headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
           data:userRequest
         })
           .then((response) => {
             
     
             setIsSubmitted(true);
     
           })
           } catch (error) {
             console.error("Error while creating user:", error);
           }
         }, null);

         const mapUserRequest= (id) => {
            return {
              Id: id,
              FullName: formData.FullName,
              UserName: formData.Email,
              Role: formData.Role,
              Password: formData.Password,
              ConfirmPassword: formData.ConfirmPassword,
              ShipperAccountCode: formData.ClientAccountCode || "",              
              Shipper: mapShipperRequest(),              
              UserPermissions: formData.Permissions ? formData.Permissions.join() : "",
              AdditionalInfo: formData.AdditionalInfo              
            }
         }

         const mapShipperRequest= () => {
            return  formData.Role === "Shipper" ? {              
                ShipperName: formData.FullName,
                Address1: formData.Address1,
                Address2: formData.Address2,
                Address3: formData.Address3,
                City: formData.City,
                State: formData.State,
                Zip: formData.Zip,
                Country: formData.Country,
                Phone: formData.Phone,
                CompanyEmail: formData.CompanyEmail,
                Vat: formData.Vat,
                Eori: formData.Eori,
                Ioss: formData.Ioss,
                Aen: formData.Aen,
                Abn: formData.Abn,
                Grt: formData.Grt,
                TaxId: formData.TaxId,
                WareHouse:formData.WareHouse,
                ClientAccountCode:formData.ClientAccountCode || "",
                Timezone:formData.Timezone,
                Currency:formData.Currency,
                ApiKey:formData.ApiKey,
                LabelType:formData.LabelType,
                DimensionUnits:formData.DimensionUnits,
                WeightUnits:formData.WeightUnits,
                GeoCodeServiceProvider:formData.GeoCodeServiceProvider, 
                EnableConsigneeEmails :formData.EnableConsigneeEmails, 
                EnablePushBackChargeableWeight :formData.EnablePushBackChargeableWeight, 
                EnableSFTP :formData.EnableSFTP, 
                EnableHurricane :formData.EnableHurricane, 
                EnableLabelSuppression :formData.EnableLabelSuppression, 
                EnableAutoAccept :formData.EnableAutoAccept
            } : null
         }

  const handleToggleChange = (fieldName) => {
    setFormData({ ...formData, [fieldName]: !formData[fieldName] })
  }

  const renderStep = () => {
    if (isSubmitted) {
      return <SuccessMessage />
    }
    debugger;
    switch (currentStep) {        
      case 1:   
        
            return <BasicInfoForm formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} />
        
        
      case 2:
        {
          if (formData.Role === "Shipper") {
          return (
            <CompanyInfoForm
              formData={formData}
              handleInputChange={handleInputChange}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )
        }else{
          return (
          <PermissionsForm
            formData={formData}
            handlePermissionChange={handlePermissionChange}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        )
        }
        }
      case 3:
        if (formData.Role === "Shipper") {
        return (
          <AdditionalInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleToggleChange={handleToggleChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )
    }      
      case 4:
        if( formData.Role === "Shipper") {
        return (
          <PermissionsForm
            formData={formData}
            handlePermissionChange={handlePermissionChange}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        ) } 
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">User Registration</h1>

        <ProgressBar currentStep={currentStep} totalSteps={getTotalSteps()} role={formData.Role} />

        <div className="mt-8">{renderStep()}</div>
      </div>
    </div>
  )
}


