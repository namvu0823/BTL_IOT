import React from "react";
import { FaFingerprint, FaIdCard, FaTable } from "react-icons/fa"; // Import icons
import "./Sidebar.css";

function Sidebar({ setActiveComponent }) {
  return (
    <div className="sidebar">
      <button onClick={() => setActiveComponent("Fingerprint")}>
        <FaFingerprint style={{ marginRight: "10px" }} />
        Fingerprint
      </button>
      <button onClick={() => setActiveComponent("RFID")}>
        <FaIdCard style={{ marginRight: "10px" }} />
        RFID
      </button>
      <button onClick={() => setActiveComponent("AccessManagement")}>
        <FaTable style={{ marginRight: "10px" }} />
        Access Management
      </button>
    </div>
  );
}

export default Sidebar;
