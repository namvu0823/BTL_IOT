import React, { useState } from "react";
import { addRFID, getRFIDByUserId } from "../services/rfid";

function RFID() {
  const [userId, setUserId] = useState("");
  const [cardUID, setCardUID] = useState("");
  const [rfidCards, setRfidCards] = useState([]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addRFID({ userId, cardUID });
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
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Card UID"
          value={cardUID}
          onChange={(e) => setCardUID(e.target.value)}
        />
        <button type="submit">Add RFID</button>
      </form>
      <form onSubmit={handleFetch}>
        <button type="submit">Fetch RFID Cards</button>
      </form>
      <ul>
        {rfidCards.map((card, index) => (
          <li key={index}>Card UID: {card.card_uid}</li>
        ))}
      </ul>
    </div>
  );
}

export default RFID;
