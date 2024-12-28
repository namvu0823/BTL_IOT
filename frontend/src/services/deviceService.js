import api from "./api";

// lấy tất cả thiết bị
export const getAllDevices = async() =>{
    try {
        const response = await api.get("/api/devices");
        return response.data; 
      } catch (error) {
        console.error("Error get devices", error);
        throw error; 
      }
}

// lấy thiết bị theo id
export const getDeviceByPort = async (id_port) => {
    try {
      const response = await api.get(`/api/devices/${id_port}`,id_port);
      return response.data;
    } catch (error) {
      console.error("Error fetching Device by id_port:", error);
      throw error;
    }
  };

  // cập nhật thiết bị
export const updateDevice = async (id_port, updatedData) => {
    try {
      const response = await api.put(`/api/devices/${id_port}`, updatedData);
      return response.data; // Trả về kết quả từ API
    } catch (error) {
      console.error("Error updating Device:", error);
      throw error; 
    }
  };

  // xóa thiết bị
  export const deletedDevice = async (id_port, deleteData) => {
    try {
      const response = await api.delete(`/api/users/${id_port}`, deleteData);
      return response.data; // Trả về kết quả từ API
    } catch (error) {
      console.error("Error delete Device:", error);
      throw error; 
    }
  };

