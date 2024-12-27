const Admin = require('../models/Admin');

// Lấy thông tin admin 
exports.getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findOne();  
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin', error });
    }
};

// update 
exports.updateAdmin = async (req, res) => {
    const { name, password , avatar } = req.body;

    try {
        const updatedAdmin = await Admin.findOneAndUpdate(
            {},  // Điều kiện để tìm admin, bỏ trống vì chỉ có 1 admin
            { name, password, avatar },
            { new: true } 
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin', error });
    }
};

