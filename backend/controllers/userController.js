const db = require('../config/db_connect');
const bcrypt = require('bcrypt');

// Lấy toàn bộ danh sách người dùng (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT ma_nguoi_dung, ho_ten, email, so_dien_thoai, vai_tro, la_thanh_vien_premium FROM nguoi_dung');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
    try {
        const { ho_ten, anh_dai_dien } = req.body;
        await db.query(
            'UPDATE nguoi_dung SET ho_ten = ?, anh_dai_dien = ? WHERE ma_nguoi_dung = ?',
            [ho_ten, anh_dai_dien, req.user.ma_nguoi_dung]
        );
        res.json({ success: true, message: 'Cập nhật hồ sơ thành công' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Đổi mật khẩu
exports.updatePassword = async (req, res) => {
    try {
        const { mat_khau_cu, mat_khau_moi } = req.body;
        const [users] = await db.query('SELECT mat_khau_ma_hoa FROM nguoi_dung WHERE ma_nguoi_dung = ?', [req.user.ma_nguoi_dung]);
        
        const isMatch = await bcrypt.compare(mat_khau_cu, users[0].mat_khau_ma_hoa);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Mật khẩu cũ không chính xác' });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(mat_khau_moi, salt);

        await db.query('UPDATE nguoi_dung SET mat_khau_ma_hoa = ? WHERE ma_nguoi_dung = ?', [hash, req.user.ma_nguoi_dung]);
        res.json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Xóa người dùng (Admin)
exports.deleteUser = async (req, res) => {
    try {
        await db.query('DELETE FROM nguoi_dung WHERE ma_nguoi_dung = ?', [req.params.id]);
        res.json({ success: true, message: 'Đã xóa người dùng' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};