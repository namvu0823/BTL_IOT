import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AccessManagement from "./pages/AccessManagement/AccessManagement";
import DeviceManagement from "./pages/DeviceManagement/DeviceManagement"
import UserManagement from "./pages/UserManagement/UserManagement";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="content-wrapper">
          <Sidebar />
          <div className="main">
            <Routes>
              <Route path="/access-management" element={<AccessManagement />} />
              <Route path="/user-list" element={<UserManagement />} />
              <Route path="/device-management" element={<DeviceManagement />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
