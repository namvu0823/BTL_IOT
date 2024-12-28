import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom'; // Import useNavigate ở đây
import "./Sidebar.css";

library.add(fas);

function Sidebar({}) {
  return (
    <div className="sidebar">
      <NavLink className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")} to='/access-management'>
        <FontAwesomeIcon icon="fa-solid fa-location-dot" />
        <div className="sidebar-title">Quản lý truy nhập</div>
      </NavLink>

      <NavLink className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")} to='/user-list'>
        <FontAwesomeIcon icon="fa-solid fa-people-roof" />
        <div className="sidebar-title">Danh sách người dùng</div>
      </NavLink>

      <NavLink className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")} to='/device-management'>
        <FontAwesomeIcon icon="fa-solid fa-list-check" />
        <div className="sidebar-title">Danh sách thiết bị</div>
      </NavLink>

      <NavLink className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")} to='/user-management'>
        <FontAwesomeIcon icon="fa-solid fa-bars-progress" />
        <div className="sidebar-title">Quản lý người dùng</div>
      </NavLink>
    </div>
  );
}

export default Sidebar;