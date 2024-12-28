import api from "./api";

// tạo lịch sử
export const saveHistory = async(historyData) =>{
    try {
        const response = await api.post("/api/history", historyData);
        return response.data; 
      } catch (error) {
        console.error("Error save history", error);
        throw error; 
      }
}

// lấy tất cả lịch sử
export const getAllHistory = async() =>{
    try {
        const response = await api.get("/api/history");
        return response.data; 
      } catch (error) {
        console.error("Error get history", error);
        throw error; 
      }
}

// lấy lịch sử theo người dùng
export const getHistoryByUid = async(UID) =>{
    try {
        const response = await api.post(`/api/history/${UID}`, UID);
        return response.data; 
      } catch (error) {
        console.error("Error get history by UID", error);
        throw error; 
      }
}

// lấy lịch sử theo cổng
export const getHistoryByPort = async(id_port) =>{
    try {
        const response = await api.post(`/api/history/${id_port}`, id_port);
        return response.data; 
      } catch (error) {
        console.error("Error get history by port", error);
        throw error; 
      }
}

