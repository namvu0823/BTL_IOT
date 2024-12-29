
const History = require('../models/History'); 
const User = require('../models/User'); 

// Hàm saveHistory để lưu lịch sử
exports.saveHistory = async (req, res) => {
  try {
    const { header,UID,time,id_port,status } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!header || !UID || !id_port) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: header, UID, or id_port.',
      });
    }
    const user = await User.findOne({ UID });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this UID.',
      });
    }

    // Lấy thời gian thực và định dạng thành chuỗi
    //const time_in = new Date().toISOString(); // ISO 8601 format (e.g., "2024-12-28T12:34:56.789Z")

    // Tạo bản ghi lịch sử mới
    const history = new History({
      id_port:id_port, // Thêm id_port
      UID: UID,
      finger: user.finger||null,
      time_in: time, // Lưu thời gian thực dạng chuỗi
      status: status
    });

    await history.save();

    res.status(201).json({
      success: true,
      message: 'History record saved successfully',
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving history record',
      error: error.message,
    });
  }
};


exports.getAllHistory = async (req, res) => {
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

exports.getHistoryById = async (req, res) => {
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


// Lấy lịch sử theo `id_port`
exports.getHistoryByPort = async (req, res) => {
  try {
    const { id_port } = req.params;
    const histories = await History.find({ id_port }).sort({ time_in: -1 });
    if (!histories || histories.length === 0) {
      return res.status(404).json({ message: 'No history found for this port' });
    }
    res.json(histories);
  } catch (err) {
    console.error('Error fetching histories:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllHistory = async (req, res) => {
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

exports.getHistoryById = async (req, res) => {
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


// Lấy lịch sử theo `id_port`
exports.getHistoryByPort = async (req, res) => {
  try {
    const { id_port } = req.params;
    const histories = await History.find({ id_port }).sort({ time_in: -1 });
    if (!histories || histories.length === 0) {
      return res.status(404).json({ message: 'No history found for this port' });
    }
    res.json(histories);
  } catch (err) {
    console.error('Error fetching histories:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


