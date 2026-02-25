const db = require('../config/db_connect');

// Lấy danh sách thông báo của tôi
exports.getMyNotifications = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM thong_bao WHERE ma_nguoi_dung = ? ORDER BY ngay_gui DESC',
            [req.user.ma_nguoi_dung]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
    try {
        await db.query('UPDATE thong_bao SET da_doc = TRUE WHERE ma_thong_bao = ? AND ma_nguoi_dung = ?', [req.params.id, req.user.ma_nguoi_dung]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};