const db = require('../config/db_connect');

exports.findBestHost = async (req, res) => {
    try {
        const { vi_do, kinh_do } = req.body;

        // Công thức tính khoảng cách Haversine trong SQL
        const query = `
            SELECT h.*, n.ho_ten, 
            (6371 * acos(cos(radians(?)) * cos(radians(vi_do)) * cos(radians(kinh_do) - radians(?)) + sin(radians(?)) * sin(radians(vi_do)))) AS khoang_cach
            FROM ho_so_chu_nha h
            JOIN nguoi_dung n ON h.ma_nguoi_dung = n.ma_nguoi_dung
            WHERE h.trang_thai_hoat_dong = 'dang_online'
            HAVING khoang_cach < 2
            ORDER BY diem_danh_gia_tb DESC, khoang_cach ASC
            LIMIT 5
        `;

        const [rows] = await db.query(query, [vi_do, kinh_do, vi_do]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};