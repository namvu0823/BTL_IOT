import api from "./api";

export const addRFID = (data) => {
  return api.post("/api/rfid", data).then((res) => res.data);
};

export const getRFIDByUserId = (userId) => {
  return api.get(`/api/rfid/${userId}`).then((res) => res.data);
};
