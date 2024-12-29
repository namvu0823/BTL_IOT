import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // Thay đổi URL nếu backend của bạn chạy ở nơi khác
});

export default api;
