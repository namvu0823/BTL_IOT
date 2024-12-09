import React, { useState } from "react";
import Fingerprint from "./components/Fingerprint";
import RFID from "./components/RFID";
import AccessManagement from "./components/AccessManagement";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [activeComponent, setActiveComponent] = useState("Fingerprint");

  return (
    <div className="app-container">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="main">
        <div className="title">
          <h1>IoT Unlock System</h1>
        </div>
        {activeComponent === "Fingerprint" && <Fingerprint />}
        {activeComponent === "RFID" && <RFID />}
        {activeComponent === "AccessManagement" && <AccessManagement />}
      </div>
    </div>
  );
}

export default App;
