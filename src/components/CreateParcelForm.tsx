import * as React from "react"
import { Check,Plus, X, ShoppingCart, Loader2, PackageOpen, Send, Settings, User, Info, Package } from "lucide-react"
import { Button } from "./ui/button"
import { CardHeader,CardContent, Card } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Dialog, DialogContent, DialogTrigger,DialogClose } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Textarea } from "./ui/textarea"
import { useNavigate,useLocation } from 'react-router-dom';
import axios from "axios";
import { Value } from "@radix-ui/react-select"
import { Description } from "@radix-ui/react-dialog"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"

interface ParcelItem {
  Id: number
  Quantity: number
  Currency: string
  TotalValue: number
  Description: string
  Weight: number
  WeightUnit: string
  Length: number
  Width: number
  Height: number
  DimensionUnit: string
  Country: string
  SkuCode: string
  HsCode: string
  ImportHsCode: string
  CpcCode: string
  ExportHsCode: string
  ItemUrl: string
  ImageUrl: string
}



export function CreateParcelForm() {
  const [open, setOpen] = React.useState(false);
  const totalSteps = 4;
  const steps = [
    { id: "info", title: "Service Info", icon: <Info size={20} /> },    
    { id: "userdetail", title: "User Info", icon: <Settings size={20} /> },
    { id: "parcel", title: "Parcel Items", icon: <Package size={20} /> },
    { id: "checkout", title: "Checkout", icon: <ShoppingCart size={20} /> }
  ];
  
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  let navigate = useNavigate();
  const location = useLocation();
  const [parcelData, setParcelData] = React.useState({
 
    ServiceId: "",
    LabelFormat: "",
    Currency: "",
    OrderReference: "",
    CodAmount: 0,
    Weight: 0,
    WeightUnit: "",
    Length: 0,
    Width: 0,
    Height: 0,
    DimensionUnit: "",
    ShippingCost: 0,
    ValueOfGoods: 0,
    Description: "",
    CustomerReference: "",
    DangerousGoods: false,
    ConsigneeName: "",
    ConsigneeCompanyName: "",
    ConsigneeAddress1: "",
    ConsigneeAddress2: "",
    ConsigneeAddress3: "",
    ConsigneeCity: "",
    ConsigneeState: "",
    ConsigneeZip: "",
    ConsigneeCountry: "",
    ConsigneePhone: "",
    ConsigneeEmail: "",
    ConsigneeId: "",
    Eori: "",    
    Type: "",
    Value: 0,
    AddressCode:"",
    Incoterm:"",
    Price:0,
    ShipperConfig: {
        ShipperName: "",
        AccountCode: "",
        Address1: "",
        Address2: "",
        Address3: "",
        City: "",
        State: "",
        Zip: "",
        Country: "",
        Phone: "",
        Email: "",
        Ioss: "",
        Vat: ""
    },
    Items: [
        {
          Id: 0,
          Quantity: 0,
          Currency: "",
          TotalValue:0,
          Description: "",
          Weight: 0,
          WeightUnit: "",
          Length: 0,
          Width: 0,
          Height: 0,
          DimensionUnit: "",
          Country: "",
          SkuCode: "",
          HsCode: "",
          ImportHsCode: "",
          CpcCode: "",
          ExportHsCode: "",
          ItemUrl: "",
          ImageUrl: "",
        }
    ]
     
   });

   const [shipperConfigData, setshipperConfigData] = React.useState({
        ShipperName: "",
        AccountCode: "",
        Address1: "",
        Address2: "",
        Address3: "",
        City: "",
        State: "",
        Zip: "",
        Country: "",
        Phone: "",
        Email: "",
        Ioss: "",
        Vat: ""
   });

   const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (/CreateParcelForm/.test(window.location.href)) {
      setOpen(true);
      onLoadParcel();
    }
  }, []);

  const onLoadParcel = React.useCallback(() => {
    debugger;

    const shipperConfig= {
      "ShipperName": location.state.ShipperName
    }

    const myJSON = JSON.stringify(shipperConfig);
    axios(
      {
        method: "POST",
        url: "https://7uwv62mcpb.execute-api.eu-west-2.amazonaws.com/dev/shipperconfig",
        headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
        data: myJSON
      }            
  )
  .then(response => { 
    debugger;
    
    // Store results in the results array
   
       const results = {
        ShipperName: response.data.ShipperName,
        AccountCode: response.data.AccountCode,
        Address1: response.data.Address1,
        Address2: response.data.Address2,
        Address3: response.data.Address3,
        City: response.data.City,
        State: response.data.State,
        Zip: response.data.Zip,
        Country: response.data.Country,
        Phone: response.data.Phone,
        Email: response.data.Email,
        Ioss: response.data.Ioss,
        Vat: response.data.Vat
      };  

    setshipperConfigData(results);     
                       
  });
  }, null);

    const openParcelTable =()=>{
      debugger;
      setOpen(false);
      navigate("/parcels");
    }

    const CreateParcel =()=>{
      debugger;
      parcelData.Items = parcels;
      parcelData.ShipperConfig =shipperConfigData;
      const myJSON = JSON.stringify(parcelData);

      CreateNewParcel(parcelData);
      
    }


    const CreateNewParcel = React.useCallback((params) =>  {    
   
      axios(
        {
            method: "POST",
            url: "https://7uwv62mcpb.execute-api.eu-west-2.amazonaws.com/dev/shipment",
            data:params,
            headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
        }            
    )
    .then(response => { 
      navigate("/parcels");
      });
    }, []);

    const setDangerousGoods =()=>{
      checked== true? setChecked(false) : setChecked(true);
      parcelData.DangerousGoods = checked;

    }

    const [parcels, setParcels] = React.useState<ParcelItem[]>([
      {
        Id: 1,
        Quantity: 0,
        Currency: "GBP",
        TotalValue: 0,
        Description: "",
        Weight: 0,
        WeightUnit: "kg",
        Length: 0,
        Width: 0,
        Height: 0,
        DimensionUnit: "cm",
        Country: "",
        SkuCode: "",
        HsCode: "",
        ImportHsCode: "",
        CpcCode: "",
        ExportHsCode: "",
        ItemUrl: "",
        ImageUrl: "",
      },
    ])
    const [selectedParcelId, setSelectedParcelId] = React.useState(1)
  
    const addNewParcel = () => {
       let newId = 1;

      if(parcels.length > 0){
        let maximumId = Math.max(...parcels.map(o => o.Id));

        newId = maximumId + 1;
      }else{
        newId = 1;
      }
      setParcels([
        ...parcels,
        {
          Id: newId,
          Quantity: 0,
          Currency: "GBP",
          TotalValue: 0,
          Description: "",
          Weight: 0,
          WeightUnit: "kg",
          Length: 0,
          Width: 0,
          Height: 0,
          DimensionUnit: "cm",
          Country: "",
          SkuCode: "",
          HsCode: "",
          ImportHsCode: "",
          CpcCode: "",
          ExportHsCode: "",
          ItemUrl: "",
          ImageUrl: "",
        },
      ])
      setSelectedParcelId(newId)
    }
  
    const deleteParcel = (id: number) => {
      debugger;
      if (parcels.length > 1) {
        const newParcels = parcels.filter((parcel) => parcel.Id !== id)
        setParcels(newParcels)
        setSelectedParcelId(newParcels[0].Id)
      }
    }

    function changeParcelsTextboxHandler(index,event) {
      debugger;
      //event.persist;
    
      let value = event.target.value;
      const results=[...parcels];
      const parcel= results[index];

      Object.keys(parcel).forEach(key => {

        if(key === event.target.name){
          if(event.target.type === "number"){
            parcel[key] = parseInt(value);
          }else{
            parcel[key] = value;
          }          
        }
     })
      
      setParcels(results);
    };

    function changeParcelsDropdownHandler(index,event ,name) {
      debugger;
      //event.persist;
    
      let value = event;
      const results=[...parcels];
      const parcel= results[index];

      Object.keys(parcel).forEach(key => {

        if(key === name){          
            parcel[key] = value;               
        }
     })
      
      setParcels(results);
    };

    function changeParcelDataTextboxHandler(event,name) {
      debugger;
      let value = event.target.value;  
      const result= {...parcelData};       
      Object.keys(result).forEach(key => {          
        if(key === name){
          if(event.target.type === "number"){
            result[key] = parseInt(value);
          }else{
            result[key] = value;
          }          
        }
     })
      
      setParcelData(result);
    };

    function changeParcelDataDropdownHandler(event ,name) {

      const result= {...parcelData}; 
      Object.keys(result).forEach(key => {

        if(key === name){          
          result[key] = event;               
        }
     })
      
      setParcelData(result);
    };

    // Navigation functions
  const nextStep = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep(activeStep + 1)
    }
  }
  
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }
    
  

  return (
    // <Dialog open={open} onOpenChange={setOpen} >      
    //   <DialogContent className="max-w-3xl h-[90vh] p-0">
    //     <DialogClose onClick={openParcelTable}/>
       
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="p-6 border-b">          
            
            {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Button */}
              <div className="flex flex-col items-center relative">
                <button
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    index < activeStep 
                      ? "bg-green-500 border-green-500 text-white"
                      : index === activeStep
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  {index < activeStep ? (
                    <Check size={20} />
                  ) : (
                    step.icon
                  )}
                </button>
                <span className={`text-sm mt-2 ${index === activeStep ? "font-semibold text-blue-500" : "text-gray-500"}`}>
                  {step.title}
                </span>
                
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    index < activeStep ? "bg-green-500 text-white" : 
                    index === activeStep ? "bg-blue-500 text-white" : 
                    "bg-gray-300 text-gray-600"
                  }`}>
                    {index + 1}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 relative">
                  <div className="absolute inset-0 bg-gray-200"></div>
                  <div 
                    className="absolute inset-0 bg-blue-500 transition-all" 
                    style={{ width: index < activeStep ? "100%" : "0%" }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
          </div>       
        
        {/* Content area */}
        <div className="p-6">
            {/* Step 1: Package Details */}
            {activeStep === 0 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Service and Label */}
                  <Card>
                    <CardHeader className="pb-3">
                      <h3 className="text-lg font-medium">Service and Label</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="service">Service</Label>
                        <Select 
                          value={parcelData.ServiceId}
                          onValueChange={(e) => changeParcelDataDropdownHandler(e,"ServiceId")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TRK001">Express (TRK001)</SelectItem>
                            <SelectItem value="TRK002">Standard (TRK002)</SelectItem>
                            <SelectItem value="TRK003">Economy (TRK003)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="labelFormat">Label Format</Label>
                        <Select value={parcelData.LabelFormat} onValueChange={(e) => changeParcelDataDropdownHandler(e,"LabelFormat")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zpl-200">ZPL-200</SelectItem>
                            <SelectItem value="zpl-300">ZPL-300</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="orderRef">Order Reference</Label>
                        <Input 
                          id="orderRef" 
                          value={parcelData.OrderReference} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"OrderReference")}
                          placeholder="Enter order reference"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Price Information */}
                  <Card>
                    <CardHeader className="pb-3">
                      <h3 className="text-lg font-medium">Price Information</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="valueGoods">Value of Goods</Label>
                          <div className="flex gap-2">                                                    
                          <Input 
                            id="valueGoods" 
                            type="number" 
                            value={parcelData.ValueOfGoods} 
                            onChange={ (e)=> changeParcelDataTextboxHandler(e,"ValueOfGoods")}
                            placeholder="0.00"
                          />
                            <Select 
                              value={parcelData.Currency}                               
                              onValueChange={(e)=> changeParcelDataDropdownHandler(e,"Currency")}
                              
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="codAmount">COD Amount</Label>
                          <Input 
                            id="codAmount" 
                            type="number" 
                            value={parcelData.CodAmount} 
                            onChange={ (e)=> changeParcelDataTextboxHandler(e,"CodAmount")}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shippingCost">Shipping Cost</Label>
                          <Input 
                            id="shippingCost" 
                            type="number" 
                            value={parcelData.ShippingCost} 
                            onChange={ (e)=> changeParcelDataTextboxHandler(e,"ShippingCost")}
                            placeholder="0.00"
                          />
                        </div>
                        
                        
                        
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Package Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-medium">Package Information</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="weight" 
                            type="number" 
                            value={parcelData.Weight} 
                            onChange={ (e)=> changeParcelDataTextboxHandler(e,"Weight")}
                            placeholder="0"
                          />
                          <Select                             
                            value={parcelData.WeightUnit} 
                            onValueChange={(e) => changeParcelDataDropdownHandler(e,"WeightUnit")}
                            
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="length">Length</Label>
                        <Input 
                          id="length" 
                          type="number" 
                          value={parcelData.Length} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"Length")}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="width">Width</Label>
                        <Input 
                          id="width" 
                          type="number" 
                          value={parcelData.Width} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"Width")}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="height">Height</Label>
                        <Input 
                          id="height" 
                          type="number" 
                          value={parcelData.Height} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"Height")}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dimensionUnit">Unit</Label>
                        <Select 
                          value={parcelData.DimensionUnit} 
                          onValueChange={(e) => changeParcelDataDropdownHandler(e,"DimensionUnit")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          value={parcelData.Description} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"Description")}
                          placeholder="Enter package description"
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerRef">Customer Reference</Label>
                        <Input 
                          id="customerRef" 
                          value={parcelData.CustomerReference} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"CustomerReference")}
                          placeholder="Enter customer reference"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-8">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="dangerous" 
                          checked={parcelData.DangerousGoods}
                          onCheckedChange={() => setDangerousGoods()}
                        />
                        <Label htmlFor="dangerous" className="font-medium">
                          Dangerous Goods
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="incoterm" className="font-medium">Incoterm</Label>
                        <Select 
                          value={parcelData.Incoterm} 
                          onValueChange={(e) => changeParcelDataDropdownHandler(e,"Incoterm")}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DDU">DDU</SelectItem>
                            <SelectItem value="DDP">DDP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Addresses */}
            {activeStep === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Sender Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Sender Information</h3>
                      <Badge variant="outline" className="bg-blue-50">Saved Address</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senderName">Name</Label>
                        <Input 
                          id="senderName" 
                          value={shipperConfigData.ShipperName} 
                          disabled
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="senderCompany">Company</Label>
                        <Input 
                          id="senderCompany" 
                          value={shipperConfigData.AccountCode} 
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderAddress1">Address Line 1</Label>
                      <Input 
                        id="senderAddress1" 
                        value={shipperConfigData.Address1} 
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderAddress2">Address Line 2</Label>
                      <Input 
                        id="senderAddress2" 
                        value={shipperConfigData.Address2} 
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="senderAddress3">Address Line 3</Label>
                      <Input 
                        id="senderAddress3" 
                        value={shipperConfigData.Address3} 
                        disabled
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senderCity">City</Label>
                        <Input 
                          id="senderCity" 
                          value={shipperConfigData.City} 
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                      <Label htmlFor="senderState">State</Label>
                      <Input 
                        id="senderState" 
                        value={shipperConfigData.State} 
                        disabled
                      />
                    </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="senderZip">Postal Code</Label>
                        <Input 
                          id="senderZip" 
                          value={shipperConfigData.Zip} 
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderCountry">Country</Label>
                      <Input 
                        id="senderCountry" 
                        value={shipperConfigData.Country === "GB" ? "United Kingdom" : shipperConfigData.Country} 
                        disabled
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senderPhone">Phone</Label>
                        <Input 
                          id="senderPhone" 
                          value={shipperConfigData.Phone} 
                          disabled
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="senderEmail">Email</Label>
                        <Input 
                          id="senderEmail" 
                          value={shipperConfigData.Email} 
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sender-vat">VAT</Label>
                        <Input id="sender-vat" 
                               value={shipperConfigData.Vat}/>
                      </div>
                       <div className="space-y-2">
                         <Label htmlFor="sender-ioss">IOSS</Label>
                         <Input id="sender-ioss" 
                                value={shipperConfigData.Ioss}/>
                          </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recipient Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-medium">Recipient Information</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName">Name *</Label>
                        <Input 
                          id="recipientName" 
                          value={parcelData.ConsigneeName} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeName")}
                          placeholder="Enter recipient name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipientCompany">Company</Label>
                        <Input 
                          id="recipientCompany" 
                          value={parcelData.ConsigneeCompanyName} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeCompanyName")}
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientAddress1">Address Line 1 *</Label>
                      <Input 
                        id="recipientAddress1" 
                        value={parcelData.ConsigneeAddress1} 
                        onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeAddress1")}
                        placeholder="Enter address line 1"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientAddress2">Address Line 2</Label>
                      <Input 
                        id="recipientAddress2" 
                        value={parcelData.ConsigneeAddress2} 
                        onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeAddress2")}
                        placeholder="Enter address line 2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientAddress3">Address Line 3</Label>
                      <Input 
                        id="recipientAddress3" 
                        value={parcelData.ConsigneeAddress3} 
                        onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeAddress3")}
                        placeholder="Enter address line 3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientCity">City *</Label>
                        <Input 
                          id="recipientCity" 
                          value={parcelData.ConsigneeCity} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeCity")}
                          placeholder="Enter city"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipientState">State/Region</Label>
                        <Input 
                          id="recipientState" 
                          value={parcelData.ConsigneeState} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeState")}
                          placeholder="Enter state/region"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientZip">Postal Code *</Label>
                        <Input 
                          id="recipientZip" 
                          value={parcelData.ConsigneeZip} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeZip")}
                          placeholder="Enter postal code"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipientCountry">Country *</Label>
                        <Select 
                          value={parcelData.ConsigneeCountry} 
                          onValueChange={(e)=> changeParcelDataDropdownHandler(e,"ConsigneeCountry")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                            <SelectItem value="IT">Italy</SelectItem>
                            <SelectItem value="ES">Spain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientPhone">Phone *</Label>
                        <Input 
                          id="recipientPhone" 
                          value={parcelData.ConsigneePhone} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneePhone")}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail">Email</Label>
                        <Input 
                          id="recipientEmail" 
                          value={parcelData.ConsigneeEmail} 
                          onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeEmail")}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dest-id">ID NUMBER</Label>
                        <Input id="dest-id" 
                               value={parcelData.ConsigneeId} 
                               onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeId")}/>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                                            <Label htmlFor="dest-type">TYPE</Label>
                                            <Select value={parcelData.Type} onValueChange={(e) => changeParcelDataDropdownHandler(e,"Type")}>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="type1">Type 1</SelectItem>
                                                {/* Add more types as needed */}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="dest-value">VALUE</Label>
                                            <Input type="number" id="dest-value" value={parcelData.Value} onChange={ (e)=> changeParcelDataTextboxHandler(e,"Value")}/>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="dest-address-code">ADDRESS CODE</Label>
                                          <Input id="dest-address-code" value={parcelData.AddressCode} onChange={ (e)=> changeParcelDataTextboxHandler(e,"AddressCode")}/>
                                        </div>
                    
                    
                   
                  </CardContent>
                </Card>
              </div>
            )}

            {activeStep === 2 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium">Parcel Items</h3>
                      <button 
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                        onClick={addNewParcel}
                      >
                        <Plus size={16} /> Add Parcel
                      </button>
                    </div>
                    
                {/* Parcel Tabs */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {parcels.map((parcel) => (
                    <div 
                      key={parcel.Id} 
                      className={`relative px-4 py-2 rounded-md cursor-pointer ${
                        selectedParcelId === parcel.Id 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setSelectedParcelId(parcel.Id)}
                    >
                      <span className="mr-4">Parcel #{parcel.Id}</span>
                      {parcels.length > 1 && (
                        <button
                          className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteParcel(parcel.Id);
                          }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Current Parcel Form */}
                {parcels.map((parcel, index) => (
                  parcel.Id === selectedParcelId && (
                    <div key={parcel.Id} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Quantity</label>
                          <input 
                            type="number" 
                            name="Quantity" 
                            className="border rounded-md p-2 w-full" 
                            value={parcel.Quantity}
                            onChange={(e) => changeParcelsTextboxHandler(index, e)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Total Value</label>
                          <input 
                            type="number" 
                            name="TotalValue" 
                            className="border rounded-md p-2 w-full" 
                            value={parcel.TotalValue}
                            onChange={(e) => changeParcelsTextboxHandler(index, e)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Currency</label>
                          <select 
                            className="border rounded-md p-2 w-full" 
                            value={parcel.Currency}
                            onChange={(e) => changeParcelsDropdownHandler(index, e, "Currency")}
                          >
                            <option value="GBP">GBP</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea 
                          name="Description" 
                          className="border rounded-md p-2 w-full min-h-[80px]" 
                          value={parcel.Description}
                          onChange={(e) => changeParcelsTextboxHandler(index, e)}
                        />
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-medium">Country of Origin</label>
                          <div className="flex gap-2">                            
                            <select 
                              className="border rounded-md p-2 w-full"  
                              value={parcel.Country}
                              onChange={(e) => changeParcelsDropdownHandler(index, e, "Country")}
                            >
                              <option value="GB">United Kingdom</option>
                              <option value="US">United States</option>
                              <option value="DE">Germany</option>
                            </select>
                          </div>
                        </div>
                      </div>                      

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                                              <label className="text-sm font-medium">SKU Code</label>
                                              <Input className="border rounded-md p-2 w-full" name="SkuCode" placeholder="SKU Code" value={parcel.SkuCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                                            </div>
                                            <div className="space-y-2">
                                              <label className="text-sm font-medium">HS Code</label>
                                              <Input className="border rounded-md p-2 w-full" name="HsCode" placeholder="HS Code" value={parcel.HsCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                                            </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Import HS Code</label>
                                          <Input className="border rounded-md p-2 w-full" name="ImportHsCode" placeholder="Import HS Code" value={parcel.ImportHsCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">CPC Code</label>
                                          <Input className="border rounded-md p-2 w-full" name="CpcCode" placeholder="CPC Code" value={parcel.CpcCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                                        </div>                                        
                                      </div>
                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                          <label className="text-sm font-medium">Export HS Code</label>
                                          <Input className="border rounded-md p-2 w-full" name="ExportHsCode" placeholder="Export HS Code" value={parcel.ExportHsCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Item URL</label>
                                          <Input className="border rounded-md p-2 w-full" name="ItemUrl" placeholder="Item URL" value={parcel.ItemUrl} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Image URL</label>
                                          <Input className="border rounded-md p-2 w-full" name="ImageUrl" placeholder="Image URL" value={parcel.ImageUrl} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                                        </div>
                                      </div>

                    </div>
                  )
                ))}
              </div>
            )}
            
            {activeStep === 3 && (
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-4">Checkout</h3>
                <p className="text-gray-600 mb-6">Review your shipping information before completing your order.</p>
                <div className="flex flex-col items-center">
                  <Package size={64} className="text-blue-500 mb-4" />
                  <button onClick={CreateParcel} className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors">
                    Complete Order
                  </button>                  
                </div>
                <div className="flex flex-col items-center">
                <X size={64} className="text-blue-500 mb-4" />
                    <button  className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors" onClick={openParcelTable}>
                       Cancel    
                  </button>
                </div>
              </div>
            )}
         </div>          
          
          {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={activeStep === 0}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={activeStep === totalSteps - 1}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700"
        >
          Next
        </button>
      </div>
        </div>
    </div>
    </div>   
    
  )
}

