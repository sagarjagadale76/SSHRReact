import * as React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

export default function StcFilter({ table_data, onFilterApply }) {
  const [filterApplied, setFilterApplied] = React.useState(false);
  const [destinationOptions, setDestinationOptions] = React.useState<string[]>(
    []
  );
  const [serviceOptions, setServiceIdOptions] = React.useState<string[]>([]);
  const [shipperOptions, setShipperOptions] = React.useState<string[]>([]);
  const [carrierOptions, setCarrierOptions] = React.useState<string[]>([]);
  //const [selectedDestination, setSelectedDestination] = React.useState("");
  const [formData, setFormData] = React.useState({
    destination: "",
    serviceId: "",
    shipperName: "",
    carrierName: "",
  });
  const [rowData, setRowData] = React.useState(table_data);

  // const [options, setOptions] = React.useState({
  //   destinations: [],
  // });

  React.useEffect(() => {
    if (table_data && table_data.length > 0) {
      const destinations: string[] = Array.from(
        new Set(
          rowData
            .map((d) => d.destination)
            .filter(
              (d) =>
                d !== undefined && d !== null && d !== "" && d !== "undefined"
            )
        )
      );

      const serviceIds: string[] = Array.from(
        new Set(
          rowData
            .map((data) => data.parcel_list.map((parcel) => parcel.serviceID))
            .reduce(function (prev, next) {
              return prev.concat(next);
            })
        )
      );

      const shipperNames: string[] = Array.from(
        new Set(
          rowData
            .map((data) => data.parcel_list.map((parcel) => parcel.shipperName))
            .reduce(function (prev, next) {
              return prev.concat(next);
            })
        )
      );
      const carrierNames: string[] = Array.from(
        new Set(
          rowData
            .map((data) => data.parcel_list.map((parcel) => parcel.carrierName))
            .reduce(function (prev, next) {
              return prev.concat(next);
            })
        )
      );
      setDestinationOptions(destinations);
      setServiceIdOptions(serviceIds);
      setShipperOptions(shipperNames);
      setCarrierOptions(carrierNames);
      //console.log("Check service Options: ", serviceIds);
    }
  }, [table_data]);
  // Extract unique values for dropdown options
  //const destinations = Array.from(new Set(rowData.map((d) => d.destination)));
  // const destinationOptions = Array.from(
  //   new Set(
  //     rowData
  //       .map((d) => d.destination)
  //       .filter((d) => d !== undefined && d !== null && d !== "")
  //   )
  // );
  //const serviceOptions = 0;

  //For Grid Filters
  // const form = useForm({
  //   defaultValues: {
  //     destination: "",
  //     service: "",
  //   },
  // });
  const form = useForm({
    defaultValues: {
      destination: "",
      serviceId: "",
      shipperName: "",
      carrierName: "",
    },
  });

  // Handle form submit
  const onSubmit = (values) => {
    if (filterApplied) {
      form.reset({
        destination: "",
        serviceId: "",
        shipperName: "",
        carrierName: "",
      });
      // Also need to update our local state
      setFormData({
        destination: "",
        serviceId: "",
        shipperName: "",
        carrierName: "",
      });
      setFilterApplied(false);
      onFilterApply({
        destination: "",
        serviceId: "",
        shipperName: "",
        carrierName: "",
      });
    } else {
      const filterParams = {
        destination: values.destination || "",
        serviceId: values.serviceId || "",
        shipperName: values.shipperName || "",
        carrierName: values.carrierName || "",
      };
      setFormData(filterParams);
      onFilterApply(filterParams);
      setFilterApplied(true);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-4 items-end mb-4 w-full justify-between"
        >
          {/* Destination Dropdown */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Country</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setFormData({ ...formData, destination: value });
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  {/* <SelectContent>
                    {destinations.map((country: string, index: number) => (
                      <SelectItem key={index} value={country}></SelectItem>
                    ))}
                  </SelectContent> */}
                  <SelectContent>
                    {destinationOptions.map(
                      (country: string, index: number) => (
                        <SelectItem key={index} value={country}>
                          {country}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Service Dropdown */}
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setFormData({ ...formData, serviceId: value });
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceOptions.map((serviceId: string, index: number) => (
                      <SelectItem key={index} value={serviceId}>
                        {serviceId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Carrier Dropdown */}
          <FormField
            control={form.control}
            name="carrierName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carrier Name</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setFormData({ ...formData, carrierName: value });
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {carrierOptions.map((carrier: string, index: number) => (
                      <SelectItem key={index} value={carrier}>
                        {carrier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Shipper Dropdown */}
          <FormField
            control={form.control}
            name="shipperName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipper Name</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setFormData({ ...formData, shipperName: value });
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select shipper" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {shipperOptions.map((shipper: string, index: number) => (
                      <SelectItem key={index} value={shipper}>
                        {shipper}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">
            {filterApplied ? "Clear Filter" : "Apply Filter"}
          </Button>
        </form>
      </Form>
    </>

    // <div>Hello</div>
  );
}
