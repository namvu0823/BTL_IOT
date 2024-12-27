<<<<<<< HEAD
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Fingerprint from "./components/Fingerprint";
import RFID from "./components/RFID";
import AccessManagement from "./components/AccessManagement";
import UserManagement from "./components/UserManagement";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [activeComponent, setActiveComponent] = useState("Fingerprint");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <>
                <div className="app-container">
                  <Sidebar setActiveComponent={setActiveComponent} handleLogout={handleLogout} />
                  <div className="main">
                    <div className="title">
                      <h1>IoT Unlock System</h1>
                    </div>
                    {activeComponent === "Fingerprint" && <Fingerprint />}
                    {activeComponent === "RFID" && <RFID />}
                    {activeComponent === "AccessManagement" && <AccessManagement />}
                    {activeComponent === "UserManagement" && <UserManagement />}
                  </div>
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
=======
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
>>>>>>> c867ac6422132463d51d1a0a5b12820dd0890825
  );
}

export default App;