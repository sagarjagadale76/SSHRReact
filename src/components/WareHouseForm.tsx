import * as React from 'react';
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import './WarehouseForm.css';
import { Building2, MapPin, Clock, Phone, Mail, User, Globe, Save, X } from 'lucide-react';

export function WareHouseForm () {
  debugger;
  const [isActive, setIsActive] = React.useState(true);
  const [showPopup, setShowPopup] = React.useState(false);
  const [timezones, setTimezones] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [submitError, setSubmitError] = React.useState(null);
  const location = useLocation();
  const [formData, setFormData] = React.useState({
    Title: '',
    OperationalCode: '',
    ContactName: '',
    Address1: '',
    Address2: '',
    Address3: '',
    City: '',
    State: '',
    Zip: '',
    Country: '',
    Phone: '',
    Email: '',
    WorkingHour: '',
    TimeZone: '',
    WareHouseId:'',
    Status:''
  });

  const navigate = useNavigate()

  // Fetch timezones from API
  React.useEffect(() => {
    
    const fetchTimezones = async () => {
      setLoading(true);
      setError(null);
      
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
        setError(err.message);
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
        setLoading(false);
      }
    };

    fetchTimezones();
  }, []);

 

  function changeWareHouseTextboxHandler(event,name) {
      debugger;
      let value = event.target.value;  
      const result= {...formData};       
      Object.keys(result).forEach(key => {          
        if(key === name){
          if(event.target.type === "number"){
            result[key] = parseInt(value);
          }else{
            result[key] = value;
          }          
        }
     })
      
      setFormData(result);
    };

  function changeParcelDataDropdownHandler(event ,name) {
    debugger;
      const result= {...formData}; 
      Object.keys(result).forEach(key => {
          debugger;
        if(key === name){          
          result[key] = event.target.value;               
        }
     })
      
      setFormData(result);
    };

  // API call to save warehouse data
  const saveWarehouseToAPI = async (warehouseData) => {
    debugger;
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://85nnezxl3m.execute-api.eu-west-2.amazonaws.com/dev/warehouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu'
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(warehouseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving warehouse:', error);
      throw error;
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for API
      const warehouseData = {
        ...formData,
        isActive,
        CreatedAt: new Date().toISOString(),
        // Add any additional fields your API expects
        Status: isActive ? 'active' : 'inactive'
      };

      // Validate required fields
      if (!formData.Title || !formData.Address1 || !formData.City || !formData.Country) {
        throw new Error('Please fill in all required fields');
      }

      // Call API to save warehouse
      const result = await saveWarehouseToAPI(warehouseData);
      
      console.log('Warehouse created successfully:', result);
      
      // Show success popup
      setShowPopup(true);
      
      // Auto-close popup after 2 seconds and refresh grid
      setTimeout(() => {
        handleCloseAndRefresh();
      }, 2000);

    } catch (error) {
      setSubmitError(error.message);
      console.error('Error creating warehouse:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAndRefresh = () => {
    setShowPopup(false);
    
    // Reset form
    setFormData({
      Title: '',
      OperationalCode: '',
      ContactName: '',
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      State: '',
      Zip: '',
      Country: '',
      Phone: '',
      Email: '',
      WorkingHour: '',
      TimeZone: '',
      WareHouseId: '',
      Status:''
    });
    setIsActive(true);
    setSubmitError(null);
    navigate("/settings/warehouse");
    
  };

  const handleCancel = () => {
    debugger;
    navigate("/settings/warehouse");
  };

  const closePopup = () => {
    handleCloseAndRefresh();
  };

  const retryFetchTimezones = () => {
    // Retry fetching timezones
    setError(null);
    setLoading(true);
    // Re-trigger the useEffect by updating a dependency or call the fetch function directly
  };

      React.useEffect(() => {
      if (location.pathname === '/settings/warehouse/edit' && location.state && location.state.WareHouseId) {
        debugger;    
        onLoadParcel();
      }
    }, []);

 const onLoadParcel = React.useCallback(() => {
    debugger;
    axios(
      {
        method: "GET",
        url: "https://85nnezxl3m.execute-api.eu-west-2.amazonaws.com/dev/warehouses?warehouseId=" + location.state.WareHouseId,
        headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
      }            
  )
  .then(response => { 
    debugger;
    const results = [];
     // Store results in the results array
    response.data.map((value) => {
       results.push({
        Title: value.Title,
        OperationalCode: value.OperationalCode,
        ContactName: value.ContactName,
        Address1: value.Address1,
        Address2: value.Address2,
        Address3: value.Address3,
        City:   value.City,
        State: value.State,
        Zip: value.Zip,
        Country: value.Country,
        Phone: value.Phone,
        Email:  value.Email,
        WorkingHour: value.WorkingHour,
        TimeZone: value.TimeZone,
        WareHouseId: value.WareHouseId,
        Status:value.Status === 'active' ? setIsActive(true) : setIsActive(false)
      });

      
    }); 

    setFormData(results[0]);     
                      
  });
  }, null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {location.state?.Action} Warehouse
                </h1>
                <p className="text-slate-500 text-sm">Manage your warehouse information</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-600">Status</span>
              <div className="relative inline-flex">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                  disabled={submitting}
                  className="sr-only"
                />
                <div
                  onClick={() => !submitting && setIsActive(!isActive)}
                  className={`w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${
                    isActive ? 'bg-green-500' : 'bg-slate-300'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${
                      isActive ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-slate-500'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6 mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-red-800 font-medium">{submitError}</span>
            </div>
            <button
              onClick={() => setSubmitError(null)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow-sm border-x border-slate-200">
          {/* Basic Information */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Title}
                  onChange={(e) => changeWareHouseTextboxHandler(e, "Title")}
                  disabled={submitting}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter warehouse title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Operational Code
                </label>
                <input
                  type="text"
                  value={formData.OperationalCode}
                  onChange={(e) => changeWareHouseTextboxHandler(e, "OperationalCode")}
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter operational code"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.ContactName}
                    onChange={(e) => changeWareHouseTextboxHandler(e, "ContactName")}
                    disabled={submitting}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-800">Address Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Address1}
                  onChange={(e) => changeWareHouseTextboxHandler(e, "Address1")}
                  disabled={submitting}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter primary address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.Address2}
                    onChange={(e) => changeWareHouseTextboxHandler(e, "Address2")}
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Suite, apartment, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address Line 3
                  </label>
                  <input
                    type="text"
                    value={formData.Address3}
                    onChange={(e) => changeWareHouseTextboxHandler(e, "Address3")}
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Additional address info"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.City}
                    onChange={(e) => changeWareHouseTextboxHandler(e, "City")}
                    disabled={submitting}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.State}
                    onChange={(e) => changeWareHouseTextboxHandler(e, "State")}
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter state or province"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.Zip}
                    onChange={(e) => changeWareHouseTextboxHandler(e, "Zip")}
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter ZIP or postal code"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={formData.Country}
                      onChange={(e) => changeParcelDataDropdownHandler(e, "Country")}
                      disabled={submitting}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="IN">India</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.Phone}
                    onChange={(e) => changeWareHouseTextboxHandler(e, "Phone")}
                    disabled={submitting}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={formData.Email}
                    onChange={(e) => changeWareHouseTextboxHandler(e, "Email")}
                    disabled={submitting}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Information */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-slate-800">Operating Hours & Timezone</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Working Hours
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.WorkingHour}
                    onChange={(e) => changeWareHouseTextboxHandler(e, "WorkingHour")}
                    disabled={submitting}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="e.g. 9:00 AM - 5:00 PM"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timezone
                </label>
                <select
                  value={formData.TimeZone}
                  onChange={(e) => changeParcelDataDropdownHandler(e, "TimeZone")}
                  disabled={loading || submitting}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none"
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
                {error && (
                  <div className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <span>Error loading timezones</span>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Warehouse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-pulse">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Success!</h2>
              <p className="text-slate-600 mb-6">Warehouse has been created successfully</p>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {formData.Title}</div>
                  <div><strong>Code:</strong> {formData.OperationalCode}</div>
                  <div><strong>Location:</strong> {formData.City}, {formData.Country}</div>
                  <div><strong>Status:</strong> <span className={isActive ? 'text-green-600' : 'text-slate-500'}>{isActive ? 'Active' : 'Inactive'}</span></div>
                </div>
              </div>
              
              <button
                onClick={closePopup}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
              >
                Close & Continue
              </button>
              
              <p className="text-xs text-slate-500 mt-3">This popup will close automatically in 3 seconds...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

