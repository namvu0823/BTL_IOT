import React from "react";
import { FaFingerprint, FaIdCard, FaTable, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ setActiveComponent, handleLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout(); // Gọi hàm handleLogout từ App
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="sidebar">
      <div className="sidebar-buttons">
        <button onClick={() => setActiveComponent("Fingerprint")} className="sidebar-button">
          <FaFingerprint />
          Fingerprint
        </button>
        <button onClick={() => setActiveComponent("RFID")} className="sidebar-button">
          <FaIdCard />
          RFID
        </button>
        <button onClick={() => setActiveComponent("AccessManagement")} className="sidebar-button">
          <FaTable />
          Access Management
        </button>
        <button onClick={() => setActiveComponent("UserManagement")} className="sidebar-button"> {/* Thêm nút User Management */}
          <FaUsers />
          User Management
        </button>
      </div>
      <button onClick={handleLogoutClick} className="logout-button">
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;