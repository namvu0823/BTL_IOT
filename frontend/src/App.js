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
  const [savedPassword, setSavedPassword] = useState('password'); // Mật khẩu mặc định
  const [isPasswordChanged, setIsPasswordChanged] = useState(false); // Trạng thái mật khẩu

  const handleLogin = () => {
    setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      <Header 
        onLogout={handleLogout} 
        savedPassword={savedPassword} 
        setSavedPassword={setSavedPassword} 
        setIsPasswordChanged={setIsPasswordChanged} 
      />
      <div className="content-wrapper">
        <Sidebar onLogout={handleLogout} />
        <div className="main">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} savedPassword={savedPassword} isPasswordChanged={isPasswordChanged} />} />
            <Route path="/access-management" element={isLoggedIn ? <AccessManagement /> : <Login onLogin={handleLogin} savedPassword={savedPassword} isPasswordChanged={isPasswordChanged} />} />
            <Route path="/user-list" element={isLoggedIn ? <UserList /> : <Login onLogin={handleLogin} savedPassword={savedPassword} isPasswordChanged={isPasswordChanged} />} />
            <Route path="/device-management" element={isLoggedIn ? <DeviceManagement /> : <Login onLogin={handleLogin} savedPassword={savedPassword} isPasswordChanged={isPasswordChanged} />} />
            <Route path="/user-management" element={isLoggedIn ? <UserManagement /> : <Login onLogin={handleLogin} savedPassword={savedPassword} isPasswordChanged={isPasswordChanged} />} />
            <Route path="/" element={isLoggedIn ? <AccessManagement /> : <Login onLogin={handleLogin} savedPassword={savedPassword} isPasswordChanged={isPasswordChanged} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;