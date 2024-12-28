import api from "./api"

// lấy tất cả người dùng
export const getAllUser = async() =>{
    try {
        response = await api.get('api/users')
        return response.data
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // Ném lỗi ra để xử lý ở component
    }
}

// lấy user theo UID
export const getUserByUID = async (UID) => {
  try {
    const response = await api.get(`/api/users/${UID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    throw error;
  }
};

// tạo người dùng
export const createUser = async (userData) => {
  try {
    const response = await api.post("/api/users", userData);
    return response.data; 
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; 
  }
};

// cập nhật người dùng
export const updateUser = async (UID, updatedData) => {
    try {
      const response = await api.put(`/api/users/${UID}`, updatedData);
      return response.data; // Trả về kết quả từ API
    } catch (error) {
      console.error("Error updating user:", error);
      throw error; 
    }
  };

  // xóa người dùng
  export const deletedUser = async (UID, deleteData) => {
    try {
      const response = await api.delete(`/api/users/${UID}`, deleteData);
      return response.data; // Trả về kết quả từ API
    } catch (error) {
      console.error("Error delete user:", error);
      throw error; 
    }
  };



