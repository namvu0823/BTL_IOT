import React, { useState } from "react";
import { addFingerprint } from "../services/fingerprint";
import './Fingerprint.css';


function Fingerprint() {
  const [userId, setUserId] = useState("");
  const [fingerprintData, setFingerprintData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addFingerprint({ userId, fingerprintData });
      alert("Fingerprint added: " + response.id);
    } catch (error) {
      alert("Error adding fingerprint: " + error.message);
    }
  };

  return (
    <div>
      <h2 className="fingerprint-title">Manage Fingerprints</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <textarea
          placeholder="Fingerprint Data"
          value={fingerprintData}
          onChange={(e) => setFingerprintData(e.target.value)}
        />
        <button type="submit">Add Fingerprint</button>
      </form>
    </div>
  );
}

export default Fingerprint;
