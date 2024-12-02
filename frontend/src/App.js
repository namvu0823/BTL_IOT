import React from "react";
import Fingerprint from "./components/Fingerprint";
import RFID from "./components/RFID";

function App() {
  return (
    <div>
      <h1>IoT Unlock System</h1>
      <Fingerprint />
      <RFID />
    </div>
  );
}

export default App;
