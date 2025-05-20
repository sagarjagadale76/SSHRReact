import * as React from "react";

import { StcTable } from "./StcTable";
import axios from "axios";
import StcDashboard from "./StcDashboard";
import StcFilter from "./StcFilter";
import { Card, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";

export function StcReport() {
  const [table_data, setTable_data] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [filteredData, setFilteredData] = React.useState([]);

  const API_ENDPOINT =
    "https://bpeysyeydi.execute-api.eu-west-2.amazonaws.com/DEV/stcDetails";

  React.useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      try {
        axios({
          method: "GET",
          url: API_ENDPOINT,
          headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
        }).then((response) => {
          let results = [];
          // Store results in the results array

          results = response.data.stc_data.map((stc_data) => {
            return {
              destination: stc_data.destination_country,
              parcel_list: stc_data.parcel_list,
              avg_delivery_days: stc_data.avg_delivery_days.toFixed(2),
              avg_delivery_days_ex_customs:
                stc_data.avg_delivery_days_ex_customs.toFixed(2),
              total_parcels: stc_data.total_parcels,
              total_on_time: stc_data.total_on_time,
              total_late: stc_data.total_late,
              percentage_onTime: stc_data.percentage_onTime.toFixed(2),
              percentage_late: stc_data.percentage_late.toFixed(2),
              total_delivery_exceptions: stc_data.total_delivery_exceptions,
              percentage_delivery_exceptions:
                stc_data.percentage_delivery_exceptions.toFixed(2),
              total_in_transit: stc_data.total_in_transit,
              percentage_in_transit: stc_data.percentage_in_transit.toFixed(2),
            };
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
    fetchData();
  }, []);

  const onFilterApply = async (filterOptions) => {
    const params = new URLSearchParams();
    if (filterOptions.serviceId)
      params.append("serviceId", filterOptions.serviceId);
    if (filterOptions.shipperName)
      params.append("shipperName", filterOptions.shipperName);
    if (filterOptions.carrierName)
      params.append("carrierName", filterOptions.carrierName);
    if (filterOptions.destination)
      params.append("destinationCountry", filterOptions.destination);
    try {
      const response = await axios({
        method: "GET",
        url: `${API_ENDPOINT}?${params.toString()}`,
        headers: { "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
      });
      let results = response.data.stc_data.map((stc_data) => {
        return {
          destination: stc_data.destination_country,
          avg_delivery_days: stc_data.avg_delivery_days.toFixed(2),
          avg_delivery_days_ex_customs:
            stc_data.avg_delivery_days_ex_customs.toFixed(2),
          total_parcels: stc_data.total_parcels,
          total_on_time: stc_data.total_on_time,
          total_late: stc_data.total_late,
          percentage_onTime: stc_data.percentage_onTime.toFixed(2),
          percentage_late: stc_data.percentage_late.toFixed(2),
          total_delivery_exceptions: stc_data.total_delivery_exceptions,
          percentage_delivery_exceptions:
            stc_data.percentage_delivery_exceptions.toFixed(2),
          total_in_transit: stc_data.total_in_transit,
          percentage_in_transit: stc_data.percentage_in_transit.toFixed(2),
        };
      });
      setFilteredData(results);
      //setLoading(false);
    } catch (error) {
      console.error("Error fetching shipment data:", error);
    }
  };

  const [selectedTab, setSelectedTab] = React.useState("overview");
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex p-2 bg-gray-100">
        <button
          className={`px-4 py-2 mx-1 ${
            selectedTab === "overview" ? "bg-gray-800 text-white" : "bg-white"
          }`}
          onClick={() => setSelectedTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 mx-1 ${
            selectedTab === "STCR_summary"
              ? "bg-gray-800 text-white"
              : "bg-white"
          }`}
          onClick={() => setSelectedTab("STCR_summary")}
        >
          STCR Summary
        </button>
      </div>
      <div className="p-4">
        {selectedTab === "overview" && (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                <StcFilter
                  table_data={table_data}
                  onFilterApply={onFilterApply}
                />
                <Card className="mt-4 mb-4">
                  <CardContent>
                    <StcTable tableData={filteredData} loading={loading} />
                  </CardContent>
                </Card>
                <StcDashboard stc_data={table_data} />
              </>
            )}
          </>
        )}

        {selectedTab === "STCR_summary" && (
          <StcDashboard stc_data={table_data} />
        )}
      </div>
    </div>
  );
}
