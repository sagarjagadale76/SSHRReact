import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Download } from "lucide-react";
import "../RoutingRules.css";
import * as Papa from "papaparse";
import * as XLSX from "xlsx";

type FilterParams = {
  service: string;
  warehouse: string;
  users: string;
  carrier: string;
  country: string;
  active: string;
};

const RoutingRulesFilter = ({
  routingRules,
  onFilterApply,
  routingRuleFilterData,
}) => {
  const [filterApplied, setFilterApplied] = React.useState(false);

  const [destinationOptions, setDestinationOptions] = React.useState<string[]>(
    []
  );
  const [serviceOptions, setServiceIdOptions] = React.useState<string[]>([]);
  const [shipperOptions, setShipperOptions] = React.useState<string[]>([]);
  const [carrierOptions, setCarrierOptions] = React.useState<string[]>([]);

  // console.log("Check the routingrules values: ", routingRules);

  const getAllUsers = () => {
    let users = Array.from(
      new Set(
        routingRules.flatMap((rule) => {
          const value = rule.users?.trim();

          if (!value) return [];

          if (value.toLowerCase() === "Any") return ["Any"];

          const inclMatch = value.match(/incl\s+([^e]*)/i);
          const exclMatch = value.match(/excl\s+([^i]*)/i);

          const incl = inclMatch
            ? inclMatch[1].split(",").map((u) => u.trim())
            : [];
          const excl = exclMatch
            ? exclMatch[1].split(",").map((u) => u.trim())
            : [];

          return [...incl, ...excl].filter(Boolean);
        })
      )
    );
    //console.log("Check the users array: ", users);
    return users;
  };

  // const filterOptions = {
  //   service: Array.from(new Set(routingRules.map((rule) => rule.service))),
  //   warehouse: Array.from(new Set(routingRules.map((rule) => rule.warehouse))),
  //   users: (() => {
  //     const userSet = new Set(getAllUsers());
  //     userSet.add("Any");
  //     return Array.from(userSet);
  //   })(),
  //   carrier: (() => {
  //     const carrierSet = new Set(routingRules.map((rule) => rule.carrier));
  //     carrierSet.add("Any");
  //     return Array.from(carrierSet);
  //   })(),
  //   country: Array.from(new Set(routingRules.map((rule) => rule.country))),
  //   active: (() => {
  //     const activeSet = new Set(routingRules.map((rule) => rule.active));
  //     activeSet.add("Any");
  //     return Array.from(activeSet);
  //   })(),
  // };

  // Create filter options from routingRuleFilterData
  const filterOptions = React.useMemo(() => {
    if (!routingRuleFilterData) {
      return {
        service: ["Any"],
        warehouse: ["Any"],
        users: ["Any"],
        carrier: ["Any"],
        country: ["Any"],
        active: ["Any"],
      };
    }

    const data = routingRuleFilterData;

    return {
      service: [
        "Any",
        ...(data.services?.map((service) => service.title || service.code) ||
          []),
      ],
      warehouse: [
        "Any",
        ...(data.warehouse?.map(
          (warehouse) => warehouse.Title || warehouse.OperationalCode
        ) || []),
      ],
      users: [
        "Any",
        ...(data.users?.map((user) => user.FullName || user.UserName) || []),
      ],
      carrier: [
        "Any",
        ...(data.carrier?.map((carrier) => carrier.title || carrier.code) ||
          []),
      ],
      country: [
        "Any",
        ...(data.countries?.map((country) => country.Name || country.Code) ||
          []),
      ],
      active: ["Any", "active", "inactive"],
    };
  }, [routingRuleFilterData]);

  const [formData, setFormData] = React.useState({
    service: "All",
    warehouse: "All",
    users: "All",
    carrier: "All",
    country: "All",
    active: "All",
  });

  const form = useForm({
    defaultValues: {
      service: "Any",
      warehouse: "Any",
      users: "Any",
      carrier: "Any",
      country: "Any",
      active: "Any",
    },
  });

  const downloadCSV = () => {
    // Convert row data to CSV
    const csv = Papa.unparse(routingRules);

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "routingRules_Table.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Excel handler
  const downloadExcel = () => {
    // Convert row data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(routingRules);

    // Create workbook and download
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "routingRules_table.xlsx");
  };

  const exportData = (format) => {
    switch (format) {
      case "csv":
        downloadCSV();
        break;
      case "xlsx":
        // gridApi.exportDataAsExcel();
        downloadExcel();
        break;
      default:
        break;
    }
  };

  // Handle form submit
  const onSubmit = (values) => {
    if (filterApplied) {
      form.reset({
        service: "Any",
        warehouse: "Any",
        users: "Any",
        carrier: "Any",
        country: "Any",
        active: "Any",
      });
      // Also need to update our local state
      setFormData({
        service: "Any",
        warehouse: "Any",
        users: "Any",
        carrier: "Any",
        country: "Any",
        active: "Any",
      });
      setFilterApplied(false);
      onFilterApply({
        service: "Any",
        warehouse: "Any",
        users: "Any",
        carrier: "Any",
        country: "Any",
        active: "Any",
      });
    } else {
      const filterParams: FilterParams = {
        service: values.service || "",
        warehouse: values.warehouse || "",
        users: values.users || "",
        carrier: values.carrier || "",
        country: values.country || "",
        active: values.active || "",
      };
      setFormData(filterParams);
      onFilterApply(filterParams);
      setFilterApplied(true);
    }
  };
  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pt-4 px-4 custom-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-6 ">
            {/* Service Dropdown */}
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-sm text-gray-600 transition-all duration-200 pointer-events-none z-10
                    ${
                      field.value
                        ? "text-xs -top-1 left-3 bg-white text-blue-600"
                        : "top-3 text-gray-500"
                    }`}
                  >
                    SERVICE (CODE)
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFormData({ ...formData, service: value });
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`h-10 w-full rounded-md border-2 px-3 text-sm transition-all duration-200 bg-transparent
                        ${
                          field.value
                            ? "border-blue-500 shadow-sm"
                            : "border-gray-300 hover:border-gray-400"
                        }
                        focus:border-blue-500 focus:shadow-sm focus:outline-none`}
                      >
                        <SelectValue placeholder=" " />{" "}
                        {/* Empty space to support floating label */}
                      </SelectTrigger>
                    </FormControl>
                    {/* <SelectContent>
                    {destinations.map((country: string, index: number) => (
                      <SelectItem key={index} value={country}></SelectItem>
                    ))}
                  </SelectContent> */}
                    <SelectContent className="rounded-md border-gray-300">
                      {filterOptions.service.map(
                        (service: string, index: number) => (
                          <SelectItem key={index} value={service}>
                            {service}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Warehouse Dropdown */}
            <FormField
              control={form.control}
              name="warehouse"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-sm text-gray-600 transition-all duration-200 pointer-events-none z-10
                  ${
                    field.value
                      ? "text-xs -top-1 left-3 bg-white text-blue-600"
                      : "top-3 text-gray-500"
                  }`}
                  >
                    WAREHOUSE
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFormData({ ...formData, warehouse: value });
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`h-10 w-full rounded-md border-2 px-3 text-sm transition-all duration-200 bg-transparent
                        ${
                          field.value
                            ? "border-blue-500 shadow-sm"
                            : "border-gray-300 hover:border-gray-400"
                        }
                        focus:border-blue-500 focus:shadow-sm focus:outline-none`}
                      >
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterOptions.warehouse.map(
                        (warehouse: string, index: number) => (
                          <SelectItem key={index} value={warehouse}>
                            {warehouse}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Users Dropdown */}
            <FormField
              control={form.control}
              name="users"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-sm text-gray-600 transition-all duration-200 pointer-events-none z-10
                  ${
                    field.value
                      ? "text-xs -top-1 left-3 bg-white text-blue-600"
                      : "top-3 text-gray-500"
                  }`}
                  >
                    USERS
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFormData({ ...formData, users: value });
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`h-10 w-full rounded-md border-2 px-3 text-sm transition-all duration-200 bg-transparent
                        ${
                          field.value
                            ? "border-blue-500 shadow-sm"
                            : "border-gray-300 hover:border-gray-400"
                        }
                        focus:border-blue-500 focus:shadow-sm focus:outline-none`}
                      >
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterOptions.users.map(
                        (users: string, index: number) => (
                          <SelectItem key={index} value={users}>
                            {users}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/*Country Dropdown */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-sm text-gray-600 transition-all duration-200 pointer-events-none z-10
                  ${
                    field.value
                      ? "text-xs -top-1 left-3 bg-white text-blue-600"
                      : "top-3 text-gray-500"
                  }`}
                  >
                    COUNTRY
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFormData({ ...formData, country: value });
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`h-10 w-full rounded-md border-2 px-3 text-sm transition-all duration-200 bg-transparent
                        ${
                          field.value
                            ? "border-blue-500 shadow-sm"
                            : "border-gray-300 hover:border-gray-400"
                        }
                        focus:border-blue-500 focus:shadow-sm focus:outline-none`}
                      >
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterOptions.country.map(
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8  border-b border-gray-200">
            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* Carrier Dropdown */}
              <FormField
                control={form.control}
                name="carrier"
                render={({ field }) => (
                  <FormItem className="relative w-full">
                    <FormLabel
                      className={`absolute left-3 px-2 text-sm text-gray-600 transition-all duration-200 pointer-events-none z-10
                  ${
                    field.value
                      ? "text-xs -top-1 left-3 bg-white text-blue-600"
                      : "top-3 text-gray-500"
                  }`}
                    >
                      CARRIER
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setFormData({ ...formData, carrier: value });
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={`h-10 w-full rounded-md border-2 px-3 text-sm transition-all duration-200 bg-transparent
                        ${
                          field.value
                            ? "border-blue-500 shadow-sm"
                            : "border-gray-300 hover:border-gray-400"
                        }
                        focus:border-blue-500 focus:shadow-sm focus:outline-none`}
                        >
                          <SelectValue placeholder="Select shipper" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filterOptions.carrier.map(
                          (carrier: string, index: number) => (
                            <SelectItem key={index} value={carrier}>
                              {carrier}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* Active Dropdown */}
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="relative w-full">
                    <FormLabel
                      className={`absolute left-3 px-2 text-sm text-gray-600 transition-all duration-200 pointer-events-none z-10
                  ${
                    field.value
                      ? "text-xs -top-1 left-3 bg-white text-blue-600"
                      : "top-3 text-gray-500"
                  }`}
                    >
                      STATUS
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setFormData({ ...formData, active: value });
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={`h-10 w-full rounded-md border-2 px-3 text-sm transition-all duration-200 bg-transparent
                        ${
                          field.value
                            ? "border-blue-500 shadow-sm"
                            : "border-gray-300 hover:border-gray-400"
                        }
                        focus:border-blue-500 focus:shadow-sm focus:outline-none`}
                        >
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filterOptions.active.map(
                          (active: string, index: number) => (
                            <SelectItem key={index} value={active}>
                              {active}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            {/*Filter and Download Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 items-center pt-2 flex-2 ">
              <Button
                type="submit"
                className="bg-[#4AA3BA] hover:bg-[#3A8296] px-6 py-2"
              >
                {filterApplied ? "Clear Filter" : "Apply Filter"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-6 py-2 border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-200"
                  >
                    <Download size={16} />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 bg-white border border-gray-200 shadow-lg">
                  <DropdownMenuItem
                    onClick={() => exportData("csv")}
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  >
                    Download CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => exportData("xlsx")}
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  >
                    Download XLSX
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RoutingRulesFilter;
