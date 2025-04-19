import * as React from "react"
import { Check,Plus, X } from "lucide-react"
import { Button } from "./ui/button"
import { CardHeader,CardContent, Card } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Textarea } from "./ui/textarea"
import { useNavigate,useLocation } from 'react-router-dom';
import axios from "axios";

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


export function ParcelForm() {
  const [open, setOpen] = React.useState(false);
  let navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = React.useState(false);
  const [parcel, setParcel] = React.useState({
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

  });
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
      TrackingNumber:"",
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

  React.useEffect(() => {
    if (/ParcelForm/.test(window.location.href)) {
      setOpen(true);
      onLoadParcel();
    }
  }, []);

  const onLoadParcel = React.useCallback(() => {
    debugger;
    axios(
      {
        method: "GET",
        url: "https://7uwv62mcpb.execute-api.eu-west-2.amazonaws.com/dev/shipmentdetails?customerReferenceId=" + location.state.CustomerReference,
        headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" }
      }            
  )
  .then(response => { 
    debugger;
    const results = [];
    const items = [];
    // Store results in the results array
    response.data.map((value) => {
       results.push({
        CustomerReference: value.CustomerReference,
        TrackingNumber: value.TrackingNumber,
        OrderReference: value.OrderReference,
        ConsigneeName: value.ConsigneeName,
        ConsigneeAddress1: value.ConsigneeAddress1,
        ConsigneeAddress2: value.ConsigneeAddress2,
        ConsigneeAddress3: value.ConsigneeAddress3,
        Zip: value.Zip,
        ConsigneeCountry: value.ConsigneeCountry,
        BatchId : value.BatchId,
        ServiceId : value.ServiceId,
        ShipperCompany : value.ShipperCompany,
        ZplLabel : value.ZplLabel,
        Width: value.Width,
        Length: value.Length,
        Height: value.Height,
        Currency: value.Currency,
        Weight: value.Weight,
        Value: value.Value,        
        LabelFormat: value.LabelFormat,
        CodAmount: value.CodAmount,
        WeightUnit: value.WeightUnit,
        DimensionUnit: value.DimensionUnit,
        ShippingCost: value.ShippingCost,
        ValueOfGoods: value.ValueOfGoods,
        Description: value.Description,
        DangerousGoods: value.DangerousGoods,
        ConsigneeCompanyName: value.ConsigneeCompanyName,
      ConsigneeCity: value.ConsigneeCity,
      ConsigneeState: value.ConsigneeState,
      ConsigneeZip: value.ConsigneeZip,
      ConsigneePhone: value.ConsigneePhone,
      ConsigneeEmail: value.ConsigneeEmail,
      Type: value.Type,
      AddressCode:value.AddressCode,
      Incoterm:value.Incoterm,
      ConsigneeId : value.ConsigneeId,
      Price: value.Price,
      ShipperConfig: value.ShipperConfig
      });

      items.push({
            Id: value.ItemId,
            Quantity: value.ItemQuantity,
            Currency: value.ItemCurrency,
            TotalValue:value.ItemTotalValue,
            Description: value.ItemDescription,
            Weight: value.ItemWeight,
            WeightUnit: value.ItemWeightUnit,
            Length: value.ItemLength,
            Width: value.ItemWidth,
            Height: value.ItemHeight,
            DimensionUnit: value.ItemDimensionUnit,
            Country: value.ItemCountry,
            SkuCode: value.ItemSku,
            HsCode: value.ItemHsCode,
            ImportHsCode: value.ImportHsCode,
            CpcCode: value.ItemCpcCode,
            ExportHsCode: value.ItemExportHsCode,
            ItemUrl: value.ItemUrl,
            ImageUrl: value.ImageUrl
      });
    }); 

    setParcelData(results[0]);     
    setParcels(items);                    
  });
  }, null);

    const openParcelTable =()=>{
      setOpen(false);
      navigate("/parcels");
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
    const [activeTab, setActiveTab] = React.useState("1")
  
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
      setActiveTab(newId.toString())
    }
  
    const deleteParcel = (id: number) => {
      debugger;
      if (parcels.length > 1) {
        const newParcels = parcels.filter((parcel) => parcel.Id !== id)
        setParcels(newParcels)
        setActiveTab(newParcels[0].Id.toString())
      }
    }

    const setDangerousGoods =()=>{
      checked== true? setChecked(false) : setChecked(true);
      parcelData.DangerousGoods = checked;

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

    const CreateParcel =()=>{
      parcelData.Items = parcels;
      const myJSON = JSON.stringify(parcelData);

      CreateNewParcel(parcelData);
      
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>      
      <DialogContent className="max-w-3xl h-[90vh] p-0">
        <div className="h-full overflow-hidden flex flex-col">
          <CardHeader className="space-y-1.5 p-6">
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold">View parcel reference: {parcelData.OrderReference}</h2>
              <div className="text-sm text-blue-600">
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Data saved ok
                </span>
              </div>
              <div className="text-sm text-muted-foreground">System tracking number: {parcelData.TrackingNumber}</div>
              <div className="text-sm">
                Source: Parcel #4644
                <button className="text-blue-600 ml-2">Parcel audit</button>
              </div>
            </div>

            
          </CardHeader>



          <div className="w-full overflow-auto max-w-5xl mx-auto p-4 h-[calc(100vh-2rem)]">
      <Tabs defaultValue="info" className="w-full flex flex-col h-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger
            value="info"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            INFO AND LABEL
          </TabsTrigger>
          <TabsTrigger
            value="sender"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            SENDER AND DESTINATION
          </TabsTrigger>
          <TabsTrigger
            value="parcel"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            PARCEL ITEMS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sender" className="mt-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sender Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Sender</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sender-name">NAME</Label>
                  <Input id="sender-name"  value={parcelData.ShipperConfig.ShipperName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-company">COMPANY NAME</Label>
                  <Input id="sender-company"  value={parcelData.ShipperConfig.AccountCode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-address1">ADDRESS1</Label>
                  <Input id="sender-address1" value={parcelData.ShipperConfig.Address1} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-address2">ADDRESS2</Label>
                  <Input id="sender-address2"value={parcelData.ShipperConfig.Address2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-address3">ADDRESS3</Label>
                  <Input id="sender-address3" value={parcelData.ShipperConfig.Address3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender-city">CITY</Label>
                    <Input id="sender-city" value={parcelData.ShipperConfig.City} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-state">STATE</Label>
                    <Input id="sender-state" value={parcelData.ShipperConfig.State}/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender-zip">ZIP</Label>
                    <Input id="sender-zip" value={parcelData.ShipperConfig.Zip}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-country">COUNTRY</Label>
                    <Select value={parcelData.ShipperConfig.Country} >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country"></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        {/* Add more countries as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-phone">PHONE</Label>
                  <Input id="sender-phone" value={parcelData.ShipperConfig.Phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-email">EMAIL</Label>
                  <Input id="sender-email" value={parcelData.ShipperConfig.Email}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-vat">VAT</Label>
                  <Input id="sender-vat" value={parcelData.ShipperConfig.Vat}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-ioss">IOSS</Label>
                  <Input id="sender-ioss" value={parcelData.ShipperConfig.Ioss}/>
                </div>
              </div>
            </div>

            {/* Destination Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Destination</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dest-name">NAME</Label>
                  <Input id="dest-name" value={parcelData.ConsigneeName} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeName")}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dest-company">COMPANY NAME</Label>
                  <Input id="dest-company" value={parcelData.ConsigneeCompanyName} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeCompanyName")}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dest-address1">ADDRESS1</Label>
                  <Input id="dest-address1" value={parcelData.ConsigneeAddress1} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeAddress1")}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dest-address2">ADDRESS2</Label>
                  <Input id="dest-address2" value={parcelData.ConsigneeAddress2} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeAddress2")}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dest-address3">ADDRESS3</Label>
                  <Input id="dest-address3" value={parcelData.ConsigneeAddress3} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeAddress3")}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dest-city">CITY</Label>
                    <Input id="dest-city" value={parcelData.ConsigneeCity} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeCity")}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest-state">STATE</Label>
                    <Input id="dest-state" value={parcelData.ConsigneeState} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeState")}/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dest-zip">ZIP</Label>
                    <Input id="dest-zip" value={parcelData.ConsigneeZip} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeZip")}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest-country">COUNTRY</Label>
                    <Select value={parcelData.ConsigneeCountry} onValueChange={(e)=> changeParcelDataDropdownHandler(e,"ConsigneeCountry")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        {/* Add more countries as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dest-phone">PHONE</Label>
                  <Input id="dest-phone" value={parcelData.ConsigneePhone} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneePhone")}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dest-email">EMAIL</Label>
                  <Input id="dest-email" value={parcelData.ConsigneeEmail} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeEmail")}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dest-id">ID NUMBER</Label>
                  <Input id="dest-id" value={parcelData.ConsigneeId} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ConsigneeId")}/>
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
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="info" className="mt-6">
        <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Service and label</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Service</Label>
                      <Select value={parcelData.ServiceId} onValueChange={(e)=> changeParcelDataDropdownHandler(e,"ServiceId")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zpl-200">ZPL-200</SelectItem>
                          <SelectItem value="zpl-300">ZPL-300</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>                    
                    <div className="grid gap-2">
                      <Label>Label Format</Label>
                      <Select value={parcelData.LabelFormat} onValueChange={(e) => changeParcelDataDropdownHandler(e,"LabelFormat")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zpl-200">ZPL-200</SelectItem>
                          <SelectItem value="zpl-300">ZPL-300</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Parcel Information</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Order Reference</Label>
                        <Input value={parcelData.OrderReference} onChange={ (e)=> changeParcelDataTextboxHandler(e,"OrderReference")}/>                        
                      </div>                      
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label>Price</Label>
                        <div className="flex gap-2">
                          <Input type="number" className="flex-1" value={parcelData.Price} onChange={ (e)=> changeParcelDataTextboxHandler(e,"Price")}/>
                          <Select value={parcelData.Currency} onValueChange={(e) => changeParcelDataDropdownHandler(e,"Currency")}>
                            <SelectTrigger className="w-24">
                              <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>COD Amount</Label>
                        <div className="flex gap-2">
                          <Input type="number" value={parcelData.CodAmount} onChange={ (e)=> changeParcelDataTextboxHandler(e,"CodAmount")}/>
                          <Select onValueChange={(e)=> changeParcelDataDropdownHandler(e,"Currency")}>
                            <SelectTrigger className="w-24">
                              <SelectValue>{parcelData.Currency}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="grid gap-2">
                        <Label>Weight</Label>
                        <div className="flex gap-2">
                          <Input type="number" value={parcelData.Weight} onChange={ (e)=> changeParcelDataTextboxHandler(e,"Weight")}/>
                          <Select value={parcelData.WeightUnit} onValueChange={(e) => changeParcelDataDropdownHandler(e,"WeightUnit")}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Length</Label>
                        <div className="flex gap-2">
                          <Input type="number" value={parcelData.Length} onChange={ (e)=> changeParcelDataTextboxHandler(e,"Length")}/>
                          <Select value={parcelData.DimensionUnit} onValueChange={(e) => changeParcelDataDropdownHandler(e,"DimensionUnit")}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Width</Label>
                        <Input type="number" value={parcelData.Width} onChange={ (e)=> changeParcelDataTextboxHandler(e,"Width")}/>
                      </div>
                      <div className="grid gap-2">
                        <Label>Height</Label>
                        <Input type="number" value={parcelData.Height} onChange={ (e)=> changeParcelDataTextboxHandler(e,"Height")}/>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Shipping Cost</Label>
                        <div className="flex gap-2">
                          <Input type="number" value={parcelData.ShippingCost} onChange={ (e)=> changeParcelDataTextboxHandler(e,"ShippingCost")}/>
                          <Select onValueChange={(e)=> changeParcelDataDropdownHandler(e,"Currency")}>
                            <SelectTrigger className="w-24">
                              <SelectValue>{parcelData.Currency}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Value of Goods</Label>
                        <Input type="number" value={parcelData.Value} onChange={ (e)=> changeParcelDataTextboxHandler(e,"Value")}/>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Short Description</Label>
                      <Textarea value={parcelData.Description} onChange={ (e)=> changeParcelDataTextboxHandler(e,"Description")}/>
                    </div>                    

                    <div className="grid gap-2">
                      <Label>Customer ID Reference</Label>
                      <Input value={parcelData.CustomerReference} onChange={ (e)=> changeParcelDataTextboxHandler(e,"CustomerReference")}/>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                                  <h3 className="text-lg font-medium mb-4">Options</h3>
                                  <div className="flex gap-8">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="dangerous"  onChange={ setDangerousGoods}/>
                                      <label
                                        htmlFor="dangerous"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        Dangerous Goods
                                      </label>
                                    </div>                    
                                    <div className="flex items-center space-x-2">
                                    <div className="flex gap-4">
                                      <Select value={parcelData.Incoterm} onValueChange={(e) => changeParcelDataDropdownHandler(e,"Incoterm")}>
                                        <SelectTrigger className="w-20">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="DDU">DDU</SelectItem>
                                          <SelectItem value="DDP">DDP</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      </div>
                                      <Label>InQuota</Label>                      
                                    </div>                    
                                  </div>
                                </div>
              </div>
        </TabsContent>

        <TabsContent value="parcel">
        <div className="container mx-auto p-4 max-w-4xl">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center gap-2 mb-4">
          <TabsList>
            {parcels.map((parcel) => (
              <TabsTrigger key={parcel.Id} value={parcel.Id.toString()} className="relative">
                Parcel Item #{parcel.Id}
                {parcels.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 absolute -top-2 -right-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteParcel(parcel.Id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="outline" size="icon" onClick={addNewParcel} className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {parcels.map((parcel, index) => (
          <TabsContent key={parcel.Id} value={parcel.Id.toString()}>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Quantity</label>
                    <Input name="Quantity"  type="number" placeholder="Quantity" value={parcel.Quantity} onChange={ e=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Currency</label>
                    <Select value={parcel.Currency} onValueChange={(e) => changeParcelsDropdownHandler(index,e,"Currency")}>
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
                  <div className="space-y-2">
                    <label className="text-sm">Total Value</label>
                    <Input name="TotalValue" type="number" placeholder="Total Value" value={parcel.TotalValue} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Description</label>
                  <Textarea name="Description" placeholder="Enter description" value={parcel.Description} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Weight</label>
                    <div className="flex gap-2">
                      <Input name="Weight" type="number" placeholder="Weight" value={parcel.Weight} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                      <Select value={parcel.WeightUnit} onValueChange={(e) => changeParcelsDropdownHandler(index,e, "WeightUnit")}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Length</label>
                    <Input name="Length" type="number" placeholder="Length" value={parcel.Length} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Width</label>
                    <Input name="Width" type="number" placeholder="Width" value={parcel.Width} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Height</label>
                    <Input name="Height" type="number" placeholder="Height" value={parcel.Height} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Dimension Unit</label>
                    <Select value={parcel.DimensionUnit} onValueChange={(e) => changeParcelsDropdownHandler(index,e,"DimensionUnit")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Country of Origin</label>
                  <Select value={parcel.Country} onValueChange={(e) => changeParcelsDropdownHandler(index,e,"Country")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">SKU Code</label>
                    <Input name="SkuCode" placeholder="SKU Code" value={parcel.SkuCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">HS Code</label>
                    <Input name="HsCode" placeholder="HS Code" value={parcel.HsCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Import HS Code</label>
                    <Input name="ImportHsCode" placeholder="Import HS Code" value={parcel.ImportHsCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">CPC Code</label>
                    <Input name="CpcCode" placeholder="CPC Code" value={parcel.CpcCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Export HS Code</label>
                    <Input name="ExportHsCode" placeholder="Export HS Code" value={parcel.ExportHsCode} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Item URL</label>
                    <Input name="ItemUrl" placeholder="Item URL" value={parcel.ItemUrl} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Image URL</label>
                    <Input name="ImageUrl" placeholder="Image URL" value={parcel.ImageUrl} onChange={ (e)=> changeParcelsTextboxHandler(index,e)}/>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      
    </div>
        </TabsContent>
      </Tabs>
    </div>
          
          <div className="h-20 flex justify-between p-6 border-t ">
            <Button variant="outline" onClick={openParcelTable}>
              CANCEL
            </Button>
            <Button onClick={CreateParcel}>Re-Create Parcel</Button>
          </div>
        </div>
       
      </DialogContent>
    </Dialog>
  )
}

