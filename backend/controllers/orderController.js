const db = require('../config/db_connect');

const createOrder = async (req, res) => {
    try {
        const { ma_chu_nha, khoi_luong_kg, tong_tien } = req.body;
        const hoa_hong = tong_tien * 0.15;
        const [result] = await db.query(
            'INSERT INTO don_hang (ma_khach_hang, ma_chu_nha, khoi_luong_kg, tong_tien_khach_tra, tien_hoa_hong_mmc) VALUES (?, ?, ?, ?, ?)',
            [req.user.ma_nguoi_dung, ma_chu_nha, khoi_luong_kg, tong_tien, hoa_hong]
        );
        res.status(201).json({ success: true, ma_don_hang: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM don_hang WHERE ma_khach_hang = ? OR ma_chu_nha = (SELECT ma_chu_nha FROM ho_so_chu_nha WHERE ma_nguoi_dung = ?)',
            [req.user.ma_nguoi_dung, req.user.ma_nguoi_dung]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { trang_thai_moi } = req.body;
        await db.query('UPDATE don_hang SET trang_thai_don_hang = ? WHERE ma_don_hang = ?', [trang_thai_moi, req.params.id]);
        res.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    updateOrderStatus
};