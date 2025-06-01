"use client"

import { useState } from "react"

const CompanyInfoForm = ({ formData, handleInputChange, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({})

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Ireland",
    "Portugal",
    "Poland",
    "Czech Republic",
    "Hungary",
    "Greece",
    "Turkey",
    "Japan",
    "South Korea",
    "Singapore",
    "Hong Kong",
    "India",
    "China",
    "Brazil",
    "Mexico",
    "Argentina",
    "Chile",
    "Colombia",
    "South Africa",
    "Egypt",
    "UAE",
    "Saudi Arabia",
    "Israel",
    "New Zealand",
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.Address1.trim()) {
      newErrors.Address1 = "Address 1 is required"
    }

    if (!formData.City.trim()) {
      newErrors.City = "City is required"
    }

    if (!formData.Country.trim()) {
      newErrors.Country = "Country is required"
    }

    if (!formData.Zip.trim()) {
      newErrors.Zip = "ZIP/Postal code is required"
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
    <form onSubmit={handleNext} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Company Information</h2>

      {/* Address Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Address Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address 1 *</label>
          <input
            type="text"
            name="Address1"
            value={formData.Address1}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.Address1 ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Street address, building number"
          />
          {errors.Address1 && <p className="mt-1 text-sm text-red-500">{errors.Address1}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address 2</label>
            <input
              type="text"
              name="Address2"
              value={formData.Address2}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Meridian Business Park"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address 3</label>
            <input
              type="text"
              name="Address3"
              value={formData.Address3}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional address line"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              name="City"
              value={formData.City}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.City ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="leicester"
            />
            {errors.City && <p className="mt-1 text-sm text-red-500">{errors.City}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
            <input
              type="text"
              name="State"
              value={formData.State}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="State or Province"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code *</label>
            <input
              type="text"
              name="Zip"
              value={formData.Zip}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.Zip ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="LE19 1WR"
            />
            {errors.Zip && <p className="mt-1 text-sm text-red-500">{errors.Zip}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            name="Country"
            value={formData.Country}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.Country ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Country</option>
            {countries.map((Country) => (
              <option key={Country} value={Country}>
                {Country}
              </option>
            ))}
          </select>
          {errors.Country && <p className="mt-1 text-sm text-red-500">{errors.Country}</p>}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="Phone"
              value={formData.Phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="CompanyEmail"
              value={formData.CompanyEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="company@example.com"
            />
          </div>
        </div>
      </div>

      {/* Tax and Registration Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Tax & Registration Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VAT</label>
            <input
              type="text"
              name="Vat"
              value={formData.Vat}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VAT number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EORI</label>
            <input
              type="text"
              name="Eori"
              value={formData.Eori}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="GB131090852000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IOSS</label>
            <input
              type="text"
              name="Ioss"
              value={formData.Ioss}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="IOSS number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AEN</label>
            <input
              type="text"
              name="Aen"
              value={formData.Aen}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AEN number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ABN</label>
            <input
              type="text"
              name="Abn"
              value={formData.Abn}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ABN number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GRT</label>
            <input
              type="text"
              name="Grt"
              value={formData.Grt}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="GRT number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
            <input
              type="text"
              name="TaxId"
              value={formData.TaxId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tax ID number"
            />
          </div>
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
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </form>
  )
}

export default CompanyInfoForm
