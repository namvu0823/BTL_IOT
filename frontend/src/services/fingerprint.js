import api from "./api";

export const addFingerprint = (data) => {
  return api.post("/api/fingerprint", data).then((res) => res.data);
};
