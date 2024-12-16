const RFID = require('../models/RFID'); // Import model RFID

exports.addRFID = async (req, res) => {
  const { userId, cardUID } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!userId || !cardUID) {
    return res.status(400).json({ error: 'userId and cardUID are required' });
  }

  try {
    // Tạo và lưu RFID vào MongoDB
    const newRFID = new RFID({ userId, cardUID });
    const savedRFID = await newRFID.save();

    // Trả về kết quả
    res.status(201).json({ message: 'RFID card added', id: savedRFID._id });
  } catch (error) {
    console.error('Error adding RFID card:', error); // Log lỗi
    res.status(500).json({ error: error.message });   // Trả về lỗi cho client
  }
};


exports.getRFIDByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm tất cả các RFID có userId khớp
    const rfidCards = await RFID.find({ userId });

    if (rfidCards.length === 0) {
      return res.status(404).json({ message: 'No RFID cards found for this user' });
    }

    res.status(200).json(rfidCards);
  } catch (error) {
    console.error('Error fetching RFID cards:', error); // Log lỗi
    res.status(500).json({ error: error.message });     // Trả về lỗi cho client
  }
};

exports.getAllUserRfid = async (req, res) => {
  try {
    // Lấy tất cả các RFID từ MongoDB
    const rfids = await RFID.find();

    // Kiểm tra nếu không có RFID nào
    if (rfids.length === 0) {
      return res.status(404).json({ message: 'No RFID cards found' });
    }

    // Trả về danh sách RFID
    res.status(200).json(rfids);
  } catch (error) {
    console.error('Error fetching RFID cards:', error); // Log lỗi
    res.status(500).json({ error: error.message });      // Trả về lỗi cho client
  }
};
