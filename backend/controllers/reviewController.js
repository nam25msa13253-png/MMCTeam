const db = require('../config/db_connect');
// --- PHẦN ĐÁNH GIÁ ---
exports.createReview = async (req, res) => {
    try {
        const { ma_don_hang, ma_chu_nha, so_sao, binh_luan } = req.body;
        
        await db.query(
            'INSERT INTO danh_gia (ma_don_hang, ma_khach_hang, ma_chu_nha, so_sao, binh_luan) VALUES (?, ?, ?, ?, ?)',
            [ma_don_hang, req.user.ma_nguoi_dung, ma_chu_nha, so_sao, binh_luan]
        );

        // Tối ưu: Tự động cập nhật điểm trung bình cho Chủ nhà
        const [avg] = await db.query('SELECT AVG(so_sao) as trung_binh FROM danh_gia WHERE ma_chu_nha = ?', [ma_chu_nha]);
        await db.query('UPDATE ho_so_chu_nha SET diem_danh_gia_tb = ? WHERE ma_chu_nha = ?', [avg[0].trung_binh, ma_chu_nha]);

        res.status(201).json({ success: true, message: 'Đánh giá đã được ghi nhận' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- PHẦN KHIẾU NẠI ---
exports.createDispute = async (req, res) => {
    try {
        const { ma_don_hang, ly_do, hinh_anh } = req.body;
        await db.query(
            'INSERT INTO khieu_nai (ma_don_hang, ma_nguoi_bao, ly_do, hinh_anh_bang_chung) VALUES (?, ?, ?, ?)',
            [ma_don_hang, req.user.ma_nguoi_dung, ly_do, JSON.stringify(hinh_anh)]
        );
        res.status(201).json({ success: true, message: 'Khiếu nại của bạn đã được gửi tới Ban quản trị' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};