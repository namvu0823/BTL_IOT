
const History = require('../models/History'); 
const User = require('../models/User'); 
const Device = require('../models/Device');

// Hàm lưu lịch sử
exports.saveHistory = async (req, res) => {
  try {
    const { UID, id_port, time } = req.body;  

    // 1. Lấy thông tin người dùng 
    const user = await User.findOne({ UID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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

