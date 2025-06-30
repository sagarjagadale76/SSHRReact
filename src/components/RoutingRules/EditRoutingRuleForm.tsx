import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Info } from "lucide-react";

import { RoutingRule } from "./types/RoutingRule";
import MultiSelect from "./MultiSelect";

interface FormData {
  id: number;
  active: string;
  service: string;
  warehouse: string;
  users?: string;
  priority: number;
  carrier: string;
  min_price: number;
  max_price: number;
  currency: string;
  max_dimension: number;
  max_dimension_sum: number;
  min_length: number;
  max_length: number;
  min_width: number;
  max_width: number;
  min_weight: number;
  max_weight: number;
  min_height: number;
  max_height: number;
  min_girth: number;
  max_girth: number;
  incoterm: string;
  ioss_declared: string;
  cod_declared: string;
  comment: string;
  country: string;
  zip: string;
  conditions?: string;
  descriptionKeywords?: string;
  hsCode?: string;
  countriesOfOrigin?: string;
  included_users?: string[];
  excluded_users?: string[];
}

interface EditRoutingRuleFormProps {
  rule?: RoutingRule;
  onSave: (rule: RoutingRule) => void;
  onCancel: () => void;
  routingTableData: RoutingRule[];
  routingRuleFilterData: any;
}

const EditRoutingRuleForm: React.FC<EditRoutingRuleFormProps> = ({
  rule,
  onSave,
  onCancel,
  routingTableData,
  routingRuleFilterData,
}) => {
  //   type: string,
  //   ruleData?: RoutingRule[],
  //   routingRuleFilterData?: any
  // ) => {
  //   if (rule) {
  //     let data = ruleData ?? routingTableData;
  //     let users = data.flatMap((rule) => {
  //       const value = rule.users?.trim();

  //       if (!value) return [];

  //       if (value === "Any") return ["Any"];

  //       const inclMatch = value.match(/incl\s+([^e]*)/i);
  //       const exclMatch = value.match(/excl\s+([^i]*)/i);

  //       const incl = inclMatch
  //         ? inclMatch[1].split(",").map((u) => u.trim())
  //         : [];
  //       const excl = exclMatch
  //         ? exclMatch[1].split(",").map((u) => u.trim())
  //         : [];

  //       return type === "incl"
  //         ? [...incl].filter(Boolean)
  //         : [...excl].filter(Boolean);
  //     });
  //     console.log("Check the users array: ", users);
  //     return users;
  //   } else if (routingRuleFilterData?.users) {
  //     return routingRuleFilterData.users;
  //   } else {
  //     return ["Any"];
  //   }
  // };

  const getAllUsers = (
    type: string,
    ruleData?: RoutingRule[],
    routingRuleFilterData?: any
  ) => {
    if (rule) {
      let data = ruleData ?? routingTableData;

      let users = data.flatMap((rule) => {
        const value = rule.users?.trim();

        if (!value) return [];

        if (value === "Any") return ["Any"];

        const inclMatch = value.match(/incl\s+([^]*?)(?=\s+excl|$)/i);
        const exclMatch = value.match(/excl\s+([^]*?)(?=\s+incl|$)/i);

        const incl = inclMatch
          ? inclMatch[1].split(",").map((u) => u.trim())
          : [];
        const excl = exclMatch
          ? exclMatch[1].split(",").map((u) => u.trim())
          : [];

        return type === "incl" ? incl.filter(Boolean) : excl.filter(Boolean);
      });

      console.log("Check the users array: ", users);
      return users;
    } else if (routingRuleFilterData?.users) {
      return routingRuleFilterData.users;
    } else {
      return ["Any"];
    }
  };

  function generateConditionsText(data) {
    const conditions = [];

    // Price conditions
    if (data.currency && data.min_price && data.min_price !== "Any") {
      conditions.push(`Price (${data.currency}) ≥ ${data.min_price}`);
    }

    if (data.currency && data.max_price && data.max_price !== "Any") {
      conditions.push(`Price (${data.currency}) ≤ ${data.max_price}`);
    }

    // Weight
    if (data.min_weight && data.min_weight !== "Any") {
      conditions.push(`Weight ≥ ${data.min_weight}`);
    }

    if (data.max_weight && data.max_weight !== "Any") {
      conditions.push(`Weight ≤ ${data.max_weight}`);
    }

    // Height
    if (data.min_height && data.min_height !== "Any") {
      conditions.push(`Height ≥ ${data.min_height}`);
    }

    if (data.max_height && data.max_height !== "Any") {
      conditions.push(`Height ≤ ${data.max_height}`);
    }

    // Length
    if (data.min_length && data.min_length !== "Any") {
      conditions.push(`Length ≥ ${data.min_length}`);
    }

    if (data.max_length && data.max_length !== "Any") {
      conditions.push(`Length ≤ ${data.max_length}`);
    }

    // Width
    if (data.min_width && data.min_width !== "Any") {
      conditions.push(`Width ≥ ${data.min_width}`);
    }

    if (data.max_width && data.max_width !== "Any") {
      conditions.push(`Width ≤ ${data.max_width}`);
    }

    // Girth
    if (data.min_girth && data.min_girth !== "Any") {
      conditions.push(`Girth ≥ ${data.min_girth}`);
    }

    if (data.max_girth && data.max_girth !== "Any") {
      conditions.push(`Girth ≤ ${data.max_girth}`);
    }

    // Incoterm
    if (data.incoterm && data.incoterm !== "Any") {
      conditions.push(`IncoTerm: ${data.incoterm}`);
    }

    // Comment
    if (data.comment) {
      conditions.push(`\n**Comment:**\n${data.comment}`);
    }

    return conditions.join("\n");
  }

  // const form = useForm<FormData>({
  //   defaultValues: {
  //     id: parseInt(rule.id),
  //     service: rule.service,
  //     warehouse: rule.warehouse,
  //     users: getAllUsers("incl", [rule]),
  //     excludedUsers: getAllUsers("excl", [rule]),
  //     priority: parseInt(rule.priority),
  //     country: rule.country,
  //     zip: "",
  //     descriptionKeywords: "",
  //     hsCode: "",
  //     countriesOfOrigin: "",
  //     minPrice: isNaN(parseFloat(rule.min_price))
  //       ? 0
  //       : parseFloat(rule.max_price),
  //     maxPrice: isNaN(parseFloat(rule.max_price))
  //       ? 0
  //       : parseFloat(rule.MaxPrice),
  //     minWeight: isNaN(parseFloat(rule.MinWeight))
  //       ? 0
  //       : parseFloat(rule.MinWeight),
  //     maxWeight: isNaN(parseFloat(rule.MaxWeight))
  //       ? 0
  //       : parseFloat(rule.MaxWeight),
  //     minLength: isNaN(parseFloat(rule.MinLength))
  //       ? 0
  //       : parseFloat(rule.MinLength),
  //     maxLength: isNaN(parseFloat(rule.MaxLength))
  //       ? 0
  //       : parseFloat(rule.MaxLength),
  //     minWidth: isNaN(parseFloat(rule.MinWidth))
  //       ? 0
  //       : parseFloat(rule.MinWidth),
  //     maxWidth: isNaN(parseFloat(rule.MaxWidth))
  //       ? 0
  //       : parseFloat(rule.MaxWidth),

  //     currency: rule.Currency,
  //     maxDimension: isNaN(parseFloat(rule.MaxDimension))
  //       ? 0
  //       : parseFloat(rule.MaxDimension),
  //     maxDimensionSum: isNaN(parseFloat(rule.MaxDimensionSum))
  //       ? 0
  //       : parseFloat(rule.MaxDimensionSum),
  //     comments: rule.Comment,
  //     carrier: rule.Carrier,
  //     active: rule.Active,
  //     incoTerm: rule.IncoTerm,
  //     codDeclared: rule.COD_declared || "Any",
  //     IOSS_declared: rule.IOSS_declared || "Any",
  //   },
  // });

  const form = useForm<FormData>({
    defaultValues: {
      id: parseInt(rule?.id) ?? 0,
      active: rule?.active ?? "No",
      service: rule?.service ?? "Any",
      warehouse: rule?.warehouse ?? "Any",
      users: rule?.users ?? "",
      priority: isNaN(parseInt(rule?.priority))
        ? 100
        : parseInt(rule?.priority),
      carrier: rule?.carrier ?? "",

      min_price: isNaN(parseFloat(rule?.min_price))
        ? 0
        : parseFloat(rule.min_price),
      max_price: isNaN(parseFloat(rule?.max_price))
        ? 0
        : parseFloat(rule.max_price),
      currency: rule?.currency ?? "USD",

      max_dimension: isNaN(parseFloat(rule?.max_dimension))
        ? 0
        : parseFloat(rule.max_dimension),
      max_dimension_sum: isNaN(parseFloat(rule?.max_dimension_sum))
        ? 0
        : parseFloat(rule.max_dimension_sum),

      min_length: isNaN(parseFloat(rule?.min_length))
        ? 0
        : parseFloat(rule.min_length),
      max_length: isNaN(parseFloat(rule?.max_length))
        ? 0
        : parseFloat(rule.max_length),

      min_width: isNaN(parseFloat(rule?.min_width))
        ? 0
        : parseFloat(rule.min_width),
      max_width: isNaN(parseFloat(rule?.max_width))
        ? 0
        : parseFloat(rule.max_width),

      min_weight: isNaN(parseFloat(rule?.min_weight))
        ? 0
        : parseFloat(rule.min_weight),
      max_weight: isNaN(parseFloat(rule?.max_weight))
        ? 0
        : parseFloat(rule.max_weight),

      min_height: isNaN(parseFloat(rule?.min_height))
        ? 0
        : parseFloat(rule.min_height),
      max_height: isNaN(parseFloat(rule?.max_height))
        ? 0
        : parseFloat(rule.max_height),

      min_girth: isNaN(parseFloat(rule?.min_girth))
        ? 0
        : parseFloat(rule.min_girth),
      max_girth: isNaN(parseFloat(rule?.max_girth))
        ? 0
        : parseFloat(rule.max_girth),

      incoterm: rule?.incoterm ?? "Any",
      ioss_declared: rule?.ioss_declared ?? "Any",
      cod_declared: rule?.cod_declared ?? "Any",
      comment: rule?.comment ?? "",
      country: rule?.country ?? "",
      zip: rule?.zip ?? "",
      conditions: rule?.conditions ?? "",

      // New optional fields
      descriptionKeywords: "",
      hsCode: "",
      countriesOfOrigin: "",
      included_users: rule ? getAllUsers("incl", [rule]) : getAllUsers("incl"),
      excluded_users: rule ? getAllUsers("excl", [rule]) : getAllUsers("excl"),
    },
  });

  // Create filter options from routingRuleFilterData
  const allFormOptions = React.useMemo(() => {
    if (!routingRuleFilterData) {
      return {
        service: ["Any"],
        warehouse: ["Any"],
        included_users: ["Any"],
        excluded_users: ["Any"],
        carrier: ["Any"],
        country: ["Any"],
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
      included_users: [
        "Any",
        ...(data.users?.map((user) => user.FullName || user.UserName) || []),
      ],
      excluded_users: [
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
    };
  }, [routingRuleFilterData]);

  // Helper to safely convert to string or "Any"
  const toDimensionString = (value: number | undefined) =>
    value && value !== 0 ? value.toString() : "Any";

  const onSubmit = (data: FormData) => {
    let users_list = "";

    // Filter out "Any"
    const filteredIncludedUsers = data.included_users.filter(
      (user) => user !== "Any"
    );
    if (filteredIncludedUsers.length > 0) {
      users_list += `incl ${filteredIncludedUsers.join(", ")}`;
    }

    const filteredExcludedUsers = data.excluded_users.filter(
      (user) => user !== "Any"
    );
    if (filteredExcludedUsers.length > 0) {
      if (users_list) users_list += ", ";
      users_list += `excl ${filteredExcludedUsers.join(", ")}`;
    }
    // Define all dimension fields that need fallback
    const dimensionFields = {
      min_price: toDimensionString(data.min_price),
      max_price: toDimensionString(data.max_price),
      min_weight: toDimensionString(data.min_weight),
      max_weight: toDimensionString(data.max_weight),
      min_length: toDimensionString(data.min_length),
      max_length: toDimensionString(data.max_length),
      min_width: toDimensionString(data.min_width),
      max_width: toDimensionString(data.max_width),
      max_dimension: toDimensionString(data.max_dimension),
      max_dimension_sum: toDimensionString(data.max_dimension_sum),
      min_height: toDimensionString(data.min_height),
      max_height: toDimensionString(data.max_height),
      min_girth: toDimensionString(data.min_girth),
      max_girth: toDimensionString(data.max_girth),
    };

    const updatedRule: RoutingRule = {
      ...rule,
      ...(data.id ? { id: data.id.toString() } : {}),
      active: data.active,
      service: data.service,
      warehouse: data.warehouse,
      users: users_list === "" ? "Any" : users_list,
      priority: data.priority?.toString(),
      country: data.country,
      zip: data.zip,
      currency: data.currency,
      incoterm: data.incoterm,
      cod_declared: data.cod_declared ?? "Any",
      ioss_declared: data.ioss_declared ?? "Any",
      comment: data.comment,
      carrier: data.carrier,
      conditions: generateConditionsText(data),
      ...dimensionFields,
    };

    onSave(updatedRule);
  };

  // Sample options for dropdowns
  const declaration_options = ["Any", "Yes", "No"];
  // const serviceOptions = [
  //   { value: "SVC001", label: "Service 1" },
  //   { value: "SVC002", label: "Service 2" },
  //   { value: "SVC003", label: "Service 3" },
  // ];

  const warehouseOptions = [
    { value: "WH001", label: "Warehouse 1" },
    { value: "WH002", label: "Warehouse 2" },
    { value: "WH003", label: "Warehouse 3" },
  ];

  const userOptions = [
    { value: "user1", label: "User 1" },
    { value: "user2", label: "User 2" },
    { value: "user3", label: "User 3" },
  ];

  const countries = [
    "Any",
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Australia",
    "New Zealand",
    "Japan",
    "South Korea",
    "Singapore",
    "Hong Kong",
    "China",
    "India",
    "Brazil",
    "Mexico",
  ];

  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];

  const InfoIcon = ({ text }: { text: string }) => (
    <div className="group relative inline-flex">
      <Info size={14} className="text-gray-400 cursor-help" />
      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
        {text}
        <div className="absolute top-full left-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Conditions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Conditions</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                    ${field.value ? "-top-1 " : "top-2.5"}`}
                  >
                    Service
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`
                          h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                          border-gray-300 focus:border-blue-500 focus:ring-1 
                          focus:ring-blue-500 focus:outline-none`}
                      >
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allFormOptions.service.map(
                        (service: string, index: number) => (
                          <SelectItem key={index} value={service}>
                            {service}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warehouse"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
          ${field.value ? "-top-1 " : "top-2.5"}`}
                  >
                    Warehouse
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className={`h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
              border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                      >
                        <SelectValue placeholder="Select a warehouse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allFormOptions.warehouse.map(
                        (warehouse: string, index: number) => (
                          <SelectItem key={index} value={warehouse}>
                            {warehouse}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="included_users"
              render={({ field }) => (
                <FormItem>
                  <MultiSelect
                    label="Users"
                    options={routingRuleFilterData.users.map(
                      (user) => user.FullName
                    )}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select users..."
                    variant="outline"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excluded_users"
              render={({ field }) => (
                <FormItem>
                  <MultiSelect
                    label="Excluded Users"
                    options={routingRuleFilterData.users.map(
                      (user) => user.FullName
                    )}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select excluded users..."
                    variant="outline"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      ${field.value ? "-top-1 " : "top-2.5"}`}
                  >
                    Priority
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              rules={{
                required: "Country is required",
                validate: (value) => {
                  if (!value || value === "") {
                    return "Please select a country";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500 -top-1`}
                  >
                    Country *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`
                          h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                          border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                      >
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allFormOptions.country.map(
                        (country: string, index: number) => (
                          <SelectItem key={index} value={country}>
                            {country}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <div className="relative">
                    <div className="absolute -top-2 left-3 flex items-center gap-1 bg-white px-1 z-10">
                      <FormLabel className="text-xs text-gray-600 font-medium">
                        ZIP
                      </FormLabel>
                      <InfoIcon text="Those zip codes that will be listed will be included in the rule" />
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder=""
                        className="min-h-[80px] w-full rounded border border-gray-300 px-3 py-2 text-sm resize-none
                          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
                          placeholder:text-gray-400"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionKeywords"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <div className="relative">
                    <div className="absolute -top-2 left-3 flex items-center gap-1 bg-white px-1 z-10">
                      <FormLabel className="text-xs text-gray-600 font-medium">
                        Description Keywords
                      </FormLabel>
                      <InfoIcon text="Keywords to match in parcel and product description" />
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[80px] w-full rounded border border-gray-300 px-3 py-2 text-sm resize-none
                          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
                          placeholder:text-gray-400"
                      />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hsCode"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <div className="relative">
                    <div className="absolute -top-2 left-3 flex items-center gap-1 bg-white px-1 z-10">
                      <FormLabel className="text-xs text-gray-600 font-medium">
                        HS Code
                      </FormLabel>
                      <InfoIcon text="HS Code that will be included in the rule" />
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[80px] w-full rounded border border-gray-300 px-3 py-2 text-sm resize-none
                          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
                          placeholder:text-gray-400"
                      />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="countriesOfOrigin"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <div className="relative">
                    <div className="absolute -top-2 left-3 flex items-center gap-1 bg-white px-1 z-10">
                      <FormLabel className="text-xs text-gray-600 font-medium">
                        Countries of Origin
                      </FormLabel>
                      <InfoIcon text="These COO will be included in the rule" />
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[80px] w-full rounded border border-gray-300 px-3 py-2 text-sm resize-none
                          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
                          placeholder:text-gray-400"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Parameters Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parameters</h3>

          {/*Currency */}
          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="min_price"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Min Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_price"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Max Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                    -top-1`}
                  >
                    Currency
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`
                          h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                          border-gray-300 focus:border-blue-500 focus:ring-1 
                          focus:ring-blue-500 focus:outline-none`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Weight */}
          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="min_weight"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Min Weight (kg)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_weight"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Max Weight (kg)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_dimension"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Max Dimension (cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_dimension_sum"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Max Dimension Sum (cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="min_length"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Min Length (cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_length"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Max Length (cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="min_width"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Min Width (cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_width"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Max Width (cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Height & incoterm  */}
          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="min_height"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Min Height(cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_height"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Max Height(cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="min_girth"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Min Girth(cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_girth"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`
                      absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                      -top-4.5`}
                  >
                    Max Girth(cm)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className={`
                        h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                        border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="incoterm"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                    ${field.value ? "-top-1 " : "top-2.5"}`}
                  >
                    Inco Term
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`
                          h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                          border-gray-300 focus:border-blue-500 focus:ring-1 
                          focus:ring-blue-500 focus:outline-none`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from(
                        new Set(routingTableData.map((rule) => rule.incoterm))
                      ).map((incoTerm, index) => (
                        <SelectItem key={index} value={incoTerm}>
                          {incoTerm}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ioss_declared"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                    -top-1`}
                  >
                    IOSS Declared
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`
                          h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                          border-gray-300 focus:border-blue-500 focus:ring-1 
                          focus:ring-blue-500 focus:outline-none`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {declaration_options.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cod_declared"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormLabel
                    className={`absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                    -top-1`}
                  >
                    COD Declared
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`
                          h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                          border-gray-300 focus:border-blue-500 focus:ring-1 
                          focus:ring-blue-500 focus:outline-none`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {declaration_options.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormLabel
                  className={`absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                    -top-2`}
                >
                  Comments
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-[80px] w-full rounded border border-gray-300 px-3 py-2 text-sm resize-none
                          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
                          placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Result</h3>

          <FormField
            control={form.control}
            name="carrier"
            rules={{
              required: "Carrier is required",
              validate: (value) => {
                if (!value || value == "") {
                  return "Please select a carrier";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormLabel
                  className={`absolute left-3 px-2 text-xs transition-all duration-200 bg-white z-10 text-gray-500
                    -top-2`}
                >
                  Carrier *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`
                          h-10 w-full rounded-sm border px-3 text-sm transition-colors duration-150 
                          border-gray-300 focus:border-blue-500 focus:ring-1 
                          focus:ring-blue-500 focus:outline-none`}
                    >
                      <SelectValue placeholder="Select a carrier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allFormOptions.carrier.map(
                      (carrier: string, index: number) => (
                        <SelectItem key={index} value={carrier}>
                          {carrier}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value === "Yes"}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? "Yes" : "No")
                    }
                  />
                </FormControl>
                <FormLabel>Activate routing rule</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export { EditRoutingRuleForm };
