"use client"

import { useState } from "react"

const BasicInfoForm = ({ formData, handleInputChange, nextStep, handleSubmit }) => {
  debugger;
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    debugger;
    const newErrors = {}

    if (!formData.FullName.trim()) {
      newErrors.FullName = "Full name is required"
    }

    if (!formData.Email.trim()) {
      newErrors.Email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = "Email is invalid"
    }

    if (!formData.Role) {
      newErrors.Role = "Role is required"
    }

    if (!formData.Password && window.location.pathname !== "/settings/manage-access/edit") {
      newErrors.Password = "Password is required"
    } else if (window.location.pathname !== "/settings/manage-access/edit" &&  formData.Password?.length < 6) {
      newErrors.Password = "Password must be at least 6 characters"
    }

    if (formData.Password !== formData.ConfirmPassword) {
      newErrors.ConfirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = (e) => {
    
    e.preventDefault()
    if (validateForm()) {
      nextStep()
    }
  }

  return (
    <form onSubmit={(formData.Role === "Administrator" || formData.Role === "Shipper") ? handleNext: handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="FullName"
            value={formData.FullName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.FullName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.FullName && <p className="mt-1 text-sm text-red-500">{errors.FullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="Email"
            name="Email"
            value={formData.Email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.Email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.Email && <p className="mt-1 text-sm text-red-500">{errors.Email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          name="Role"
          value={formData.Role}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.Role ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Role</option>
          <option value="Administrator">Administrator</option>
          <option value="Shipper">Shipper</option>
          <option value="ShipperCS">Shipper CS</option>
          <option value="HubWorker">Hub Worker</option>
        </select>
        {errors.Role && <p className="mt-1 text-sm text-red-500">{errors.Role}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="Password"
            name="Password"
            value={formData.Password}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.Password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.Password && <p className="mt-1 text-sm text-red-500">{errors.Password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="Password"
            name="ConfirmPassword"
            value={formData.ConfirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.ConfirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.ConfirmPassword && <p className="mt-1 text-sm text-red-500">{errors.ConfirmPassword}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button           
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>       
    </form>
  )
}

export default BasicInfoForm
