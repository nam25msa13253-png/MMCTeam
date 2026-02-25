const db = require('../config/db_connect');

// Lấy danh sách gói
const getAllPackages = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM danh_muc_goi WHERE dang_kich_hoat = TRUE');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Đăng ký gói (Hàm này hay bị thiếu gây lỗi Undefined)
const subscribePackage = async (req, res) => {
    try {
        const { ma_goi, thoi_han_ngay } = req.body;
        const ngay_bat_dau = new Date();
        const ngay_ket_thuc = new Date();
        ngay_ket_thuc.setDate(ngay_bat_dau.getDate() + thoi_han_ngay);

        const query = `
            INSERT INTO dang_ky_goi (ma_nguoi_dung, ma_goi, ngay_bat_dau, ngay_ket_thuc, trang_thai_goi) 
            VALUES (?, ?, ?, ?, 'dang_dung')
        `;
        await db.query(query, [req.user.ma_nguoi_dung, ma_goi, ngay_bat_dau, ngay_ket_thuc]);

        res.json({ success: true, message: 'Đăng ký gói thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAllPackages,
    subscribePackage
};