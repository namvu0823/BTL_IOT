import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AccessManagement from "./pages/AccessManagement/AccessManagement";
import DeviceManagement from "./pages/DeviceManagement/DeviceManagement";
import UserList from "./pages/UserList/UserList";
import UserManagement from "./components/UserManagement.js";
import Login from "./components/Login"; // Nhớ import component Login
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State quản lý đăng nhập

  const handleLogin = () => {
    setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <Sidebar onLogout={handleLogout} />
        <div className="main">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/access-management" element={isLoggedIn ? <AccessManagement /> : <Login onLogin={handleLogin} />} />
            <Route path="/user-list" element={isLoggedIn ? <UserList /> : <Login onLogin={handleLogin} />} />
            <Route path="/device-management" element={isLoggedIn ? <DeviceManagement /> : <Login onLogin={handleLogin} />} />
            <Route path="/user-management" element={isLoggedIn ? <UserManagement /> : <Login onLogin={handleLogin} />} />
            <Route path="/" element={isLoggedIn ? <AccessManagement /> : <Login onLogin={handleLogin} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;