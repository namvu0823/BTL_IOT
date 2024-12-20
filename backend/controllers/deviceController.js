const Device = require('../models/Device');

// Lấy thông tin thiết bị theo `id_port`
const getDeviceByPort = async (req, res) => {
  try {
    const { id_port } = req.params;
    const device = await Device.findOne({ id_port });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (err) {
    console.error('Error fetching device:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Tạo thiết bị mới
const createDevice = async (req, res) => {
  try {
    const { id_port, UID } = req.body;
    const newDevice = new Device({ id_port, UID });
    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (err) {
    console.error('Error creating device:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDeviceByPort,
  createDevice,
};
