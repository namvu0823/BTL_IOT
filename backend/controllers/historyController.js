const History = require('../models/History'); // Import model History
const User = require('../models/User'); // Import model User (nếu cần kiểm tra UID và Finger)

export const saveDoorHistory = async (req, res) => {
  try {
    const { id_port, UID, finger, time_in, time_out, status } = req.body;

    // Kiểm tra xem UID có tồn tại trong User collection không
    const userExists = await User.findOne({ UID });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found for the provided UID',
      });
    }

    // Kiểm tra xem vân tay (finger) có hợp lệ không
    const fingerExists = await User.findOne({ UID: finger });
    if (!fingerExists) {
      return res.status(404).json({
        success: false,
        message: 'Invalid finger information',
      });
    }

    // Tạo bản ghi lịch sử mới
    const newHistory = new History({
      id_port,
      UID,
      finger,
      time_in,
      time_out,
      status,
    });

    // Lưu bản ghi lịch sử vào cơ sở dữ liệu
    const savedHistory = await newHistory.save();

    res.status(201).json({
      success: true,
      message: 'Door access history saved successfully',
      data: savedHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving door access history',
      error: error.message,
    });
  }
};

export const getAllHistory = async (req, res) => {
    try {
      // Lấy tất cả bản ghi lịch sử và điền thông tin người dùng (UID)
      const histories = await History.find().populate('UID').populate('finger'); 
  
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

  export const getHistoryById = async (req, res) => {
    try {
      const { id } = req.params; 
  
      // Tìm bản ghi lịch sử theo _id
      const history = await History.findById(id).populate('UID').populate('finger');
  
      if (!history) {
        return res.status(404).json({
          success: false,
          message: 'History record not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'History record retrieved successfully',
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving history record',
        error: error.message,
      });
    }
  };