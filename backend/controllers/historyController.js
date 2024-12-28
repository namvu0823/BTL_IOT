
const History = require('../models/History'); 
const User = require('../models/User'); 
const Device = require('../models/Device');

//Hàm hỗ trợ set trạng thái User
const updateStatusUser = async (userId, newStatus) => {
  try {
    // Tìm người dùng theo userId
    const user = await User.findById(userId);
    
    // Nếu không tìm thấy người dùng
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    // Cập nhật trạng thái của người dùng
    user.status = newStatus;
    user.date_update = new Date(); // Cập nhật thời gian sửa đổi

    // Lưu người dùng sau khi cập nhật
    await user.save();

    // Trả về kết quả thành công
    return { success: true, message: 'User status updated successfully.', data: user };
  } catch (error) {
    // Xử lý lỗi
    return { success: false, message: 'Error updating user status.', error: error.message };
  }
};


// Hàm lưu lịch sử
exports.saveHistory = async (req, res) => {
  try {
    const { UID, id_port, time } = req.body;  

    // 1. Lấy thông tin người dùng
    const user = await User.findOne({ UID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra chắc chắn rằng user._id là hợp lệ
    if (!user._id) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    let userStatus = user.status;

    // 2. Đảo ngược trạng thái của người dùng
    userStatus = (userStatus === 'in') ? 'out' : 'in';

    // 3. Lấy thông tin thiết bị theo id_port
    const device = await Device.findOne({ id_port });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // 4. Tách thời gian thành date_in và time_in
    const [date_in, time_in] = time.split(' ');

    // 5. Tạo bản ghi mới trong cơ sở dữ liệu
    const newHistory = new History({
      userId: user._id,    
      portId: device._id,  
      date_in,
      time_in,
    });

    // Kiểm tra trường userId trước khi lưu (đảm bảo không null)
    if (!newHistory.userId) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    await newHistory.save();

    // Cập nhật trạng thái của người dùng trong cơ sở dữ liệu
    user.status = userStatus;
    await user.save();

    // Trả về phản hồi thành công
    res.status(201).json({
      success: true,
      message: 'Check-in history saved successfully',
      data: newHistory,
    });
  } catch (error) {
    console.error('Error saving history:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// exports.saveHistory = async (req, res) => {
//   try {
//       // Tạo và lưu showtime mới
//       const history = new History(req.body);
//       await history.save();

//       // Populate các trường tham chiếu
//       const populatedHistory = await history.populate(['userId', 'portId']);

//       // Trả về phản hồi thành công
//       res.status(201).json({
//           status: 'success',
//           message: 'Showtime created successfully',
//           data: populatedHistory,
//       });
//   } catch (error) {
//         console.error('Error saving history:', error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


exports.getAllHistory = async (req, res) => {
    try {
      // Lấy tất cả bản ghi lịch sử
      const histories = await History.find().populate('userId').populate('portId').sort({ date_in: -1, time_in: -1 })    
  
      if (!histories || histories.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No history records found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'All history records retrieved successfully',
        data: histories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving history records',
        error: error.message,
      });
    }
  };



// Lấy lịch sử theo `id_port`
exports.getHistoryByPort = async (req, res) => {
  try {
    const { id_port } = req.params;
    const device = await Device.findOne({id_port})
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    const histories = await History.find({ portId: device._id }).populate({portId}).sort({ date_in: -1, time_in: -1 }) 
    if (!histories || histories.length === 0) {
      return res.status(404).json({ message: 'No history found for this port' });
    }
    res.json(histories);
  } catch (err) {
    console.error('Error fetching histories:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy lịch sử theo `UID`
exports.getHistoryByUid = async (req, res) => {
  try {
    const {UID} = req.params;
    const user = await User.findOne({UID})
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const histories = await History.find({ userId: user._id }).populate('userId').sort({ date_in: -1, time_in: -1 }) 
    if (!histories || histories.length === 0) {
      return res.status(404).json({ message: 'No history found for this User' });
    }
    res.json(histories);
  } catch (err) {
    console.error('Error fetching histories:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

