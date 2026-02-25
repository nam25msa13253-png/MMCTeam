const db = require('../config/db_connect');
// Tìm kiếm chủ nhà (Note CTuấn)
exports.searchHosts = async (req, res) => {
    try {
        const query = `
            SELECT h.*, n.ho_ten, n.anh_dai_dien 
            FROM ho_so_chu_nha h
            JOIN nguoi_dung n ON h.ma_nguoi_dung = n.ma_nguoi_dung
            WHERE h.trang_thai_hoat_dong = 'dang_online'
        `;
        const [rows] = await db.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Cập nhật trạng thái hoạt động (Note CTuấn)
exports.updateStatus = async (req, res) => {
    try {
        const { trang_thai } = req.body; // 'dang_online', 'dang_ban', 'dang_offline'
        await db.query(
            'UPDATE ho_so_chu_nha SET trang_thai_hoat_dong = ? WHERE ma_nguoi_dung = ?',
            [trang_thai, req.user.ma_nguoi_dung]
        );
        res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};