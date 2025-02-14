const User = require('../models/User');

//  lấy tất cả người dùng
exports.getAllUser = async (req, res) => {
  try {
    // Truy vấn tất cả người dùng từ cơ sở dữ liệu
    const users = await User.find();

    // Kiểm tra nếu không có người dùng nào
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found.',
      });
    }

    // Trả về danh sách người dùng
    return res.status(200).json({
      success: true,
      message: 'All users retrieved successfully.',
      data: users,
    });

  } catch (error) {
    // Xử lý lỗi
    return res.status(500).json({
      success: false,
      message: 'Error retrieving users.',
      error: error.message,
    });
  }
};

// Lấy thông tin người dùng theo `UID`
exports.getUserByUID = async (req, res) => {
  try {
    const { UID } = req.params;
    const user = await User.findOne({UID});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Tạo người dùng mới (nhận từ frontend)
exports.createUser = async (req, res) => {
  try {
    const { UID, avatar, name, email } = req.body;

    if (!UID || !avatar || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: UID, avatar, name, or email.',
      });
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ UID });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this UID already exists.',
      });
    }

    // Lưu người dùng với trạng thái "Pending" (chờ finger từ WebSocket)
    const user = new User({
      UID,
      avatar,
      name,
      email,
      finger: null, // Chưa có finger
      //registration_status: 'Pending', // Trạng thái mới
      date_create: new Date().toISOString(),
      date_update: new Date().toISOString(),
    });

    const response = await fetch('/api/password', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
    });
    const result = await response.json();

    fetch('/api/thongbao_user_moi',{
      method: 'POST',
      payload: JSON.stringify({
        header:"Create new account",
        UID:UID,
        password:result.data,
      }),
    });
    
    await user.save();

    // Call the function before sending response
    await send_new_users_request(UID);

    return res.status(201).json({
      success: true,
      message: 'User created successfully. Waiting for finger.',
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating user.',
      error: error.message,
    });
  }
};

// Separate async function for sending new user request
async function send_new_users_request(UID) {
    fetch('http://localhost:3000/api/thongbao_user_moi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_port: "7",
        header: "Create new account",
        UID: UID,
        //password: result.data,
      })
    });
}


exports.updateUser = async (req, res) => {
  try {
   // const { UID } = req.params; // Lấy UID từ params
    const { UID ,finger } = req.body; // Lấy UID và finger từ body
    // Tìm người dùng dựa trên UID
    const user = await User.findOne({ UID });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
       
      });
    }else if (finger) {
      user.finger = finger; // Cập nhật trường "finger" nếu có trong body
      await user.save();
    }

    // Lưu thay đổi vào cơ sở dữ liệu
    

    // Trả về phản hồi thành công
    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: user,
    });
  } catch (error) {
    // Xử lý lỗi
    return res.status(500).json({
      success: false,
      message: 'Error updating user.',
      error: error.message,
    });
  }
};


// Hàm deleteUser để xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { UID } = req.params;

    // Kiểm tra nếu UID 
    if (!UID) {
      return res.status(400).json({
        success: false,
        message: 'UID is required.',
      });
    }

    // Tìm và xóa người dùng
    const user = await User.findOneAndDelete({ UID });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
      data: user,
    });

  } catch (error) {
    // Xử lý lỗi
    return res.status(500).json({
      success: false,
      message: 'Error deleting user.',
      error: error.message,
    });
  }
};




