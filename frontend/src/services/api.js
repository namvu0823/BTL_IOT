import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Thay đổi URL nếu backend của bạn chạy ở nơi khác
});

export default api;
