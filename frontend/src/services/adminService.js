// lấy admin
export const getAdmin = async() =>{
    try {
        response = await api.get('api/admin')
        return response.data
    } catch (error) {
        console.error("Error fetching admin:", error);
        throw error; 
    }
}

// update admin
export const updateAdmin = async (, updatedData) => {
    try {
      const response = await api.put(`/api/users/${UID}`, updatedData);
      return response.data; // Trả về kết quả từ API
    } catch (error) {
      console.error("Error updating user:", error);
      throw error; 
    }
  };