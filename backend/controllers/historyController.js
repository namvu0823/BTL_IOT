const History = require('../models/History');

// Lấy lịch sử theo `id_port`
const getHistoryByPort = async (req, res) => {
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

// Tạo bản ghi lịch sử mới
const createHistory = async (req, res) => {
  try {
    const { id_port, UID, time_in, time_out, status } = req.body;
    const newHistory = new History({ id_port, UID, time_in, time_out, status });
    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (err) {
    console.error('Error creating history:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getHistoryByPort,
  createHistory,
};
