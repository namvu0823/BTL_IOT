const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// Hàm đăng nhập admin
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm admin theo username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found!' });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials!' });
    }

    // Trả về thành công
    res.status(200).json({ message: 'Login successful!', admin: { username: admin.username } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!', error });
  }
};

// Hàm tạo admin (sử dụng cho mục đích ban đầu)
exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo admin mới
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully!', admin: { username: newAdmin.username } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!', error });
  }
};
