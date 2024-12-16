const Fingerprint = require('../models/Fingerprint')

exports.addFingerprint = async (req, res) => {
  const { userId, fingerprintData } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!userId || !fingerprintData) {
    return res.status(400).json({ error: 'userId and fingerprintData are required' });
  }

  try {
    // Tạo và lưu fingerprint vào MongoDB
    const newFingerprint = new Fingerprint({ userId, fingerprintData });
    const savedFingerprint = await newFingerprint.save();

    // Trả về kết quả
    res.status(201).json({ message: 'Fingerprint added', id: savedFingerprint._id });
  } catch (error) {
    console.error('Error adding fingerprint:', error); // Log chi tiết lỗi
    res.status(500).json({ error: error.message });    // Trả về lỗi chi tiết cho client
  }
};
 
exports.getAllUserFingerprint = async (req, res) => {
  try {
    // Lấy tất cả các fingerprint từ MongoDB
    const fingerprints = await Fingerprint.find();

    // Kiểm tra nếu không có fingerprint nào
    if (fingerprints.length === 0) {
      return res.status(404).json({ message: 'No fingerprints found' });
    }

    // Trả về danh sách fingerprint
    res.status(200).json(fingerprints);
  } catch (error) {
    console.error('Error fetching fingerprints:', error); // Log lỗi
    res.status(500).json({ error: error.message });       // Trả về lỗi chi tiết
  }
};

