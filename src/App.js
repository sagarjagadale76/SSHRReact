import React from "react";
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

import {
    Routes,
    Route,
    useNavigate
} from "react-router-dom";
import { useAuth } from './components/contexts/AuthContext'


function App() {
  debugger;
  const { user } = useAuth()
  let navigate= useNavigate()
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/login')      
    }
  }, [])
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
              {<Route path="/" element={<LoginForm/>} /> }
              {<Route path="/dashboard" element={<DashboardContent />} />}
              {<Route path="/login" element={<LoginForm />} /> }
              {/* <Route path="/export" element={<Export />} /> */}
              <Route path="/parcels" element={<ParcelsTable />} />
              <Route path="/batches" element={<ShippingDetails />} />
              <Route path="/NewBatch" element={<NewBatchPopup />} />
              <Route path="/BatchAuditDialog" element={<BatchAuditDialog />} />
              <Route path="/ParcelForm" element={<ParcelForm />} />  
              <Route path="/CreateParcelForm" element={<CreateParcelForm />} />               
            </Routes>
          </main>
        </div>
      </div>     
       
    );
}

export default App;