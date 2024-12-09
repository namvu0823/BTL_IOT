import React, { useState } from "react";
import { addRFID, getRFIDByUserId } from "../services/rfid";
import { FaUser, FaIdCard, FaPlus, FaSearch } from "react-icons/fa"; // Import icons

function RFID() {
  const [userId, setUserId] = useState("");
  const [cardUID, setCardUID] = useState("");
  const [fullName, setFullName] = useState("");
  const [rfidCards, setRfidCards] = useState([]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addRFID({ userId, cardUID, fullName });
      alert("RFID card added successfully");
    } catch (error) {
      alert("Error adding RFID card: " + error.message);
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    try {
      const cards = await getRFIDByUserId(userId);
      setRfidCards(cards);
    } catch (error) {
      alert("Error fetching RFID cards: " + error.message);
    }
  };

  return (
    <div>
      <h2>Manage RFID Cards</h2>
      <form onSubmit={handleAdd} className="rfid-form">
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="input-group">
          <FaIdCard className="icon" />
          <input
            type="text"
            placeholder="Card UID"
            value={cardUID}
            onChange={(e) => setCardUID(e.target.value)}
          />
        </div>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">
          <FaPlus className="icon" /> Add RFID
        </button>
      </form>
      <form onSubmit={handleFetch} className="rfid-form">
        <button type="submit" className="btn">
          <FaSearch className="icon" /> Fetch RFID Cards
        </button>
      </form>
      <ul className="rfid-list">
        {rfidCards.map((card, index) => (
          <li key={index} className="rfid-item">
            <p><strong>User ID:</strong> {card.user_id}</p>
            <p><strong>Full Name:</strong> {card.full_name}</p>
            <p><strong>Card UID:</strong> {card.card_uid}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RFID;
