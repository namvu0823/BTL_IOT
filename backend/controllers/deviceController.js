
const Device = require('../models/Device'); 

exports.createDevice = async (req, res) => { //Nam cần dùng đến (frontend k dùng đến)
    try {
      const { id_port, location } = req.body;
  
      // Kiểm tra nếu thiết bị đã tồn tại
      const existingDevice = await Device.findOne({ id_port });
      if (existingDevice) {
        return res.status(400).json({ message: 'Device with this id_port already exists' });
      }
  
      // Tạo mới thiết bị
      const newDevice = new Device({
        id_port,
        location,
      });
  
      const savedDevice = await newDevice.save();
      res.status(201).json({ message: 'Device created successfully', savedDevice });
    } catch (error) {
      res.status(500).json({ message: 'Error creating device', error: error.message });
    }
  };

  
  
  // lấy các thiết bị
  exports.getAllDevices = async (req, res) => {
    try {
      // Lấy tất cả thiết bị
      const devices = await Device.find();
  
      res.status(200).json({
        success: true,
        message: "Devices retrieved successfully",
        data: devices,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving devices",
        error: error.message,
      });
    }
  };
  
// lấy thiết bị bởi id
exports.getDeviceByPort = async (req, res) => {
    try {
      const { id_port } = req.params;
  
      // Tìm thiết bị theo id_port
      const device = await Device.findOne({ id_port });
  
      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Device retrieved successfully",
        data: device,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving device",
        error: error.message,
      });
    }
  };
  

// Cập nhật thiết bị
exports.updateDevice = async (req, res) => {
    try {
      const { id_port } = req.params;
      const updateFields = req.body;
  
      // Tìm thiết bị và cập nhật
      const updatedDevice = await Device.findOneAndUpdate(
        { id_port },
        updateFields,
        { new: true } 
      );
  
      if (!updatedDevice) {
        return res.status(404).json({
          success: false,
          message: "Device not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Device updated successfully",
        data: updatedDevice,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating device",
        error: error.message,
      });
    }
  };
  
// Delete a device
exports.deleteDevice = async (req, res) => {
    try {
      const { id_port } = req.params;
  
      // Tìm và xóa thiết bị
      const deletedDevice = await Device.findOneAndDelete({ id_port });
  
      if (!deletedDevice) {
        return res.status(404).json({
          success: false,
          message: "Device not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Device deleted successfully",
        data: deletedDevice,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting device",
        error: error.message,
      });
    }
  };
  
