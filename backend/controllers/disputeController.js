const db = require('../config/db_connect');

/**
 * 1. Khách hàng tạo khiếu nại mới (Note CTuấn)
 */
exports.createDispute = async (req, res) => {
    try {
        const { ma_don_hang, ly_do, hinh_anh_bang_chung } = req.body;

        // Kiểm tra xem đơn hàng có tồn tại và thuộc về khách hàng này không
        const [order] = await db.query(
            'SELECT * FROM don_hang WHERE ma_don_hang = ? AND ma_khach_hang = ?',
            [ma_don_hang, req.user.ma_nguoi_dung]
        );

        if (order.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng hợp lệ để khiếu nại' });
        }

        const query = `
            INSERT INTO khieu_nai (ma_don_hang, ma_nguoi_bao, ly_do, hinh_anh_bang_chung, trang_thai_xu_ly)
            VALUES (?, ?, ?, ?, 'moi_tiep_nhan')
        `;

        await db.query(query, [
            ma_don_hang,
            req.user.ma_nguoi_dung,
            ly_do,
            JSON.stringify(hinh_anh_bang_chung || [])
        ]);

        res.status(201).json({
            success: true,
            message: 'Khiếu nại của bạn đã được gửi. Chúng tôi sẽ phản hồi trong vòng 24h.'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * 2. Lấy danh sách khiếu nại của tôi (Khách hàng xem lại)
 */
exports.getMyDisputes = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM khieu_nai WHERE ma_nguoi_bao = ? ORDER BY ngay_khieu_nai DESC',
            [req.user.ma_nguoi_dung]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * 3. Lấy toàn bộ khiếu nại (Dành cho Admin)
 */
exports.getAllDisputes = async (req, res) => {
    try {
        const query = `
            SELECT k.*, n.ho_ten as ten_nguoi_bao, d.trang_thai_don_hang
            FROM khieu_nai k
            JOIN nguoi_dung n ON k.ma_nguoi_bao = n.ma_nguoi_dung
            JOIN don_hang d ON k.ma_don_hang = d.ma_don_hang
            ORDER BY k.ngay_khieu_nai DESC
        `;
        const [rows] = await db.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * 4. Giải quyết khiếu nại (Dành cho Admin)
 */
exports.resolveDispute = async (req, res) => {
    try {
        const { trang_thai_moi, ghi_chu_admin } = req.body;
        const ma_khieu_nai = req.params.id;

        await db.query(
            'UPDATE khieu_nai SET trang_thai_xu_ly = ?, ghi_chu_cua_admin = ? WHERE ma_khieu_nai = ?',
            [trang_thai_moi, ghi_chu_admin, ma_khieu_nai]
        );

        res.json({ success: true, message: 'Đã cập nhật tình trạng khiếu nại' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};