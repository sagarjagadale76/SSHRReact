import * as React from "react";

import RoutingRulesFilter from "./filter/RoutingRulesFilter";
import { RoutingRulesTable } from "./table/RoutingRulesTable";

import axios from "axios";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { EditRoutingRuleForm } from "./EditRoutingRuleForm";
import { RoutingRule } from "./types/RoutingRule";
import { SkeletonLoader } from "./SkeletonLoader";
import RoutingRulesSkeleton from "./RoutingRulesSkeleton";

//import { Skeleton } from "../ui/skeleton";

const RoutingRulesPage = () => {
  const API_ENDPOINT =
    "https://l95zhchj6h.execute-api.eu-west-2.amazonaws.com/DEV/GetRoutingRules";
  const [table_data, setTable_data] = React.useState<RoutingRule[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [filteredData, setFilteredData] = React.useState([]);
  const [isAddRuleOpen, setIsAddRuleOpen] = React.useState(false);
  const [routingFilterFormData, setRoutingFilterFormData] = React.useState({});

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

  // Function to flatten multidimensional routing rules array
  function flattenRoutingRules(multidimensionalArray) {
    const flatArray = [];

    // Iterate through each top-level element
    multidimensionalArray.forEach((item) => {
      if (Array.isArray(item)) {
        // If it's an array, recursively flatten it
        flatArray.push(...flattenRoutingRules(item));
      } else {
        // If it's a routing rule object, add it to the flat array
        flatArray.push(item);
      }
    });

    return flatArray;
  }

  React.useEffect(() => {
    const fetchTableData = () => {
      setLoading(true);

      try {
        axios({
          method: "GET",
          url: API_ENDPOINT,
          headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
        }).then(async (response) => {
          const results = [];
          const flatRoutingRules = await flattenRoutingRules(
            response.data.routing_rules
          );

          // Store results in the results array
          flatRoutingRules.forEach((value) => {
            results.push({
              id: value.id,
              service: value.service,
              warehouse: value.warehouse,
              users: value.users,
              country: value.country,
              priority: value.priority,
              carrier: value.carrier,
              active: value.active,
              min_price: value.min_price,
              max_price: value.max_price,
              currency: value.currency,
              max_dimension: value.max_dimension,
              max_dimension_sum: value.max_dimension_sum,
              min_length: value.min_length,
              max_length: value.max_length,
              min_width: value.min_width,
              max_width: value.max_width,
              min_weight: value.min_weight,
              max_weight: value.max_weight,
              min_height: value.min_height,
              max_height: value.max_height,
              min_girth: value.min_girth,
              max_girth: value.max_girth,
              incoterm: value.incoterm,
              ioss_declared: value.ioss_declared,
              cod_declared: value.cod_declared,
              comment: value.comment ?? "",
              zip: value.zip ?? "",
              conditions: generateConditionsText(value),
            });
          });

          setTable_data(results);
          setFilteredData(results);
          setLoading(false);
        });
      } catch (error) {
        console.error("API error:", error);
      } finally {
      }
    };
    const filterFormData = () => {
      setLoading(true);
      const API_ENDPOINT =
        "https://2ab1wru8mf.execute-api.eu-west-2.amazonaws.com/DEV/GetAllRoutingFilters";
      try {
        axios({
          method: "GET",
          url: API_ENDPOINT,
          headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
        }).then(async (response) => {
          const results = await response.data.data;

          //console.log("Check results : ", results);
          let newFormData = {};
          for (const table in results) {
            newFormData[table] = results[table];
          }

          setRoutingFilterFormData(newFormData);
          console.log("Check the new filter data: ", newFormData);
          //setTable_data(results);
          //setFilteredData(results);
          setLoading(false);
        });
      } catch (error) {
        console.error("API error:", error);
      } finally {
      }
    };
    fetchTableData();
    filterFormData();
  }, []);

  const onFilterApply = async (filterOptions) => {
    const params = new URLSearchParams();
    const keysToCheck = [
      "service",
      "warehouse",
      "carrier",
      "country",
      "users",
      "active",
    ];

    keysToCheck.forEach((key) => {
      const value = filterOptions[key];
      if (value && value !== "Any") {
        params.append(key, value);
      }
    });

    try {
      axios({
        method: "GET",
        url: `${API_ENDPOINT}?${params.toString()}`,
        headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
      }).then(async (response) => {
        const results = [];
        const flatRoutingRules = await flattenRoutingRules(
          response.data.routing_rules
        );

        flatRoutingRules.forEach((value) => {
          results.push({
            id: value.id,
            service: value.service,
            warehouse: value.warehouse,
            users: value.users,
            country: value.country,
            priority: value.priority,
            carrier: value.carrier,
            active: value.active,
            min_price: value.min_price,
            max_price: value.max_price,
            currency: value.currency,
            max_dimension: value.max_dimension,
            max_dimension_sum: value.max_dimension_sum,
            min_length: value.min_length,
            max_length: value.max_length,
            min_width: value.min_width,
            max_width: value.max_width,
            min_weight: value.min_weight,
            max_weight: value.max_weight,
            min_height: value.min_height,
            max_height: value.max_height,
            min_girth: value.min_girth,
            max_girth: value.max_girth,
            incoterm: value.incoterm,
            ioss_declared: value.ioss_declared,
            cod_declared: value.cod_declared,
            comment: value.comment ?? "",
            zip: value.zip ?? "",
            conditions: generateConditionsText(value),
          });
        });

        //setTable_data(results);
        setFilteredData(results);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching shipment data:", error);
    }
  };

  //Open the popup to add new rule
  const addRule = () => {
    setIsAddRuleOpen(true);
  };

  // on save add new rule to the DB
  const handleSave = (routingRule: RoutingRule) => {
    console.log("Save Clicked");
    const { conditions, ...latestRoutingRule } = routingRule;
    const API_ENDPOINT =
      "https://y0jwh0qg1b.execute-api.eu-west-2.amazonaws.com/DEV/AddRoutingRule";
    try {
      axios({
        method: "POST",
        url: API_ENDPOINT,
        headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
        data: latestRoutingRule,
      }).then(async (response) => {
        console.log("Check response: ", response);
      });
    } catch (error) {
      console.error("API error:", error);
    }

    setIsAddRuleOpen(false);
  };

  const handleCancel = () => {
    setIsAddRuleOpen(false);
  };

  // {loading ? (
  //         <div className="flex justify-center items-center h-screen">
  //           <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  //         </div>
  //       )

  return (
    <>
      <div className="px-4 pt-1 flex flex-col h-screen">
        {/* <RoutingRulesFilter /> */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Routing Rules</h2>
        </div>
        {loading ? (
          <RoutingRulesSkeleton />
        ) : (
          <>
            <RoutingRulesFilter
              routingRules={table_data}
              onFilterApply={onFilterApply}
              routingRuleFilterData={routingFilterFormData}
            />
            <div className="flex justify-end pb-4 pr-4">
              <Button
                className="bg-[#4AA3BA] hover:bg-[#3A8296] px-6 py-2 rounded-sm"
                onClick={addRule}
              >
                <Plus size={16} />
                Add Rule
              </Button>
            </div>

            <RoutingRulesTable
              table_data={filteredData}
              loading={loading}
              routingRuleFilterData={routingFilterFormData}
            />
            {/* <RoutingRuleTable_new /> */}
          </>
        )}
      </div>
      <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]  p-0 flex flex-col">
          <DialogHeader className="sticky top-0 z-10 bg-white border-b p-4 flex flex-row items-center justify-between">
            <DialogTitle>Add New routing rule </DialogTitle>
            <DialogClose asChild>
              <button className="text-gray-500 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </DialogHeader>
          <div className="overflow-y-auto p-4 flex-1">
            <EditRoutingRuleForm
              routingTableData={table_data}
              routingRuleFilterData={routingFilterFormData}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoutingRulesPage;
