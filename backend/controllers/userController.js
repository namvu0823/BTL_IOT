const User = require('../models/User');

// Lấy thông tin người dùng theo `UID`
const getUserByUID = async (req, res) => {
  try {
    const { UID } = req.params;
    const user = await User.findOne({ UID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Tạo người dùng mới
const createUser = async (req, res) => {
  try {
    const { date_update, UID, name, email, finger } = req.body;
    const newUser = new User({ date_update, UID, name, email, finger });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cập nhật thông tin vân tay người dùng
const updateFingerprint = async (req, res) => {
  try {
    const { UID } = req.params;
    const { finger } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { UID },
      { finger, date_update: new Date().toISOString() },
      { new: true } // Trả về bản ghi đã cập nhật
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating fingerprint:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserByUID,
  createUser,
  updateFingerprint,
};
