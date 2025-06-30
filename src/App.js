import * as React from "react";
import "./App.css";
import ShippingDetails from "./components/ShippingDetails";
import NewBatchPopup from "./components/NewBatchPopup";
import LoginForm from "./components/LoginForm";
import BatchAuditDialog from "./components/BatchAuditDialog";
import { DashboardContent } from "./components/DashboardContent";
import { Sidebar } from "./components/Sidebar";
import { ParcelsTable } from "./components/ParcelsTable";
import { CreateParcelForm } from "./components/CreateParcelForm";
import { ParcelForm } from "./components/ParcelForm";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { WareHousesTable } from "./components/WareHousesTable";
import { WareHouseForm } from "./components/WareHouseForm";
import { UserManagement } from "./components/UserAccess/UserManagement";
import { StcReport } from "./components/STC_Report/StcReport";
import UserRegistration from "./components/UserAccess/UserRegistration";
import RoutingRulesPage from "./components/RoutingRules/RoutingRulesPage";

import { Routes, Route, Outlet } from "react-router-dom";

import { ProtectedRoute, Unauthorized } from "./components/ProtectedRoute";

function App() {
  let pathName = window.location.pathname;
  let arr = pathName.toString().split("/");
  let currentPath = "";
  if (arr.length > 0) {
    arr = arr.filter((item) => item !== ""); // Remove empty strings
    currentPath = arr[arr.length - 1]; // Get the last element
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {currentPath != null &&
        currentPath.length > 0 &&
        currentPath != "login" && <Sidebar />}
      <div className="flex-1">
        <main className="bg-white m-4 rounded-lg shadow">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredPermission="View-Dash">
                  <DashboardContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parcels"
              element={
                <ProtectedRoute requiredPermission="View-Parcel">
                  <ParcelsTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/batches"
              element={
                <ProtectedRoute requiredPermission="View-Batch">
                  <ShippingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/NewBatch"
              element={
                <ProtectedRoute requiredPermission="View-Batch">
                  <NewBatchPopup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/BatchAuditDialog"
              element={
                <ProtectedRoute requiredPermission="View-Batch">
                  <BatchAuditDialog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ParcelForm"
              element={
                <ProtectedRoute requiredPermission="View-Parcel">
                  <ParcelForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CreateParcelForm"
              element={
                <ProtectedRoute requiredPermission="View-Parcel">
                  <CreateParcelForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/warehouse"
              element={
                <ProtectedRoute requiredPermission="Warehouses">
                  <WareHousesTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/warehouse/create"
              element={
                <ProtectedRoute requiredPermission="Warehouses">
                  <WareHouseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/warehouse/edit"
              element={
                <ProtectedRoute requiredPermission="Warehouses">
                  <WareHouseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/manage-access"
              element={
                <ProtectedRoute requiredPermission="UsersManageAccess">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/STCR"
              element={
                <ProtectedRoute requiredPermission="View-Reports">
                  <StcReport />
                </ProtectedRoute>
              }
            />
            <Route path="/RoutingRules" element={<RoutingRulesPage />} />
            <Route
              path="/settings/manage-access/create"
              element={
                <ProtectedRoute requiredPermission="UsersManageAccess">
                  <UserRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/manage-access/edit"
              element={
                <ProtectedRoute requiredPermission="UsersManageAccess">
                  <UserRegistration />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            {/* <Route path="/export" element={<Export />} /> */}
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="*" element={<LoginForm />} />
            {/* Unauthorized route */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
