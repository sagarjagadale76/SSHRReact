import * as React from "react";
import "./App.css";
import ShippingDetails from "./components/ShippingDetails";
import NewBatchPopup from "./components/NewBatchPopup";
import LoginForm from "./components/LoginForm";
import BatchAuditDialog from "./components/BatchAuditDialog";
import { DashboardContent } from './components/DashboardContent';
import { Sidebar } from './components/Sidebar';
import {ParcelsTable} from './components/ParcelsTable';
import {CreateParcelForm} from './components/CreateParcelForm';
import {ParcelForm} from './components/ParcelForm';
import {ResetPasswordForm} from './components/ResetPasswordForm';
import {WareHousesTable} from './components/WareHousesTable';
import {WareHouseForm} from './components/WareHouseForm';

import {
  
    Routes,
    Route,
    Outlet 
} from "react-router-dom";
import { useAuth } from './components/contexts/AuthContext';



function App() {
  debugger;
  let pathName = window.location.pathname
let arr =  pathName.toString().split("/");
let currentPath = arr[arr.length-1];

    return ( 
       
        <div className="flex min-h-screen bg-gray-100">
             {(currentPath.length > 0 && currentPath != "login") && <Sidebar />  } 
        <div className="flex-1">          
          <main className="bg-white m-4 rounded-lg shadow">
            <Routes>              
                <Route path="/dashboard" element={<DashboardContent />} />
                <Route path="/parcels" element={<ParcelsTable />} />
                <Route path="/batches" element={<ShippingDetails />} />
                <Route path="/NewBatch" element={<NewBatchPopup />} />
                <Route path="/BatchAuditDialog" element={<BatchAuditDialog />} />
                <Route path="/ParcelForm" element={<ParcelForm />} />  
                <Route path="/CreateParcelForm" element={<CreateParcelForm />} />
                <Route path="/settings/warehouse" element={<WareHousesTable />} />
                <Route path="/settings/warehouse/create" element={<WareHouseForm />} />
                <Route path="/settings/warehouse/edit" element={<WareHouseForm />} />
              
              <Route path="/" element={<LoginForm/>} />             
              <Route path="/login" element={<LoginForm />} />             
              {/* <Route path="/export" element={<Export />} /> */}              
              <Route path="/reset-password" element={<ResetPasswordForm />} />               
              <Route path="*" element={<React.Navigate to="/login" />} />              
            </Routes>
          </main>
        </div>
      </div>     
       
    );
}

export default App;