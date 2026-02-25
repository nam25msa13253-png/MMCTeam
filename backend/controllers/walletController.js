const db = require('../config/db_connect');
// Xem số dư ví của người dùng hiện tại
exports.getBalance = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT so_du_hien_tai FROM vi_dien_tu WHERE ma_nguoi_dung = ?', 
            [req.user.ma_nguoi_dung]
        );
        res.json({ 
            success: true, 
            so_du: rows[0] ? rows[0].so_du_hien_tai : 0 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy số dư', error: error.message });
    }
};

// Xử lý yêu cầu rút tiền cho Chủ nhà
exports.requestWithdraw = async (req, res) => {
    try {
        const { so_tien, thong_tin_nhan_tien } = req.body;
        
        // Kiểm tra số dư trước khi rút
        const [wallet] = await db.query(
            'SELECT so_du_hien_tai FROM vi_dien_tu WHERE ma_nguoi_dung = ?', 
            [req.user.ma_nguoi_dung]
        );

        if (!wallet[0] || wallet[0].so_du_hien_tai < so_tien) {
            return res.status(400).json({ success: false, message: 'Số dư không đủ để thực hiện giao dịch này' });
        }

        // Thực hiện trừ tiền và cập nhật thông tin
        await db.query(
            'UPDATE vi_dien_tu SET so_du_hien_tai = so_du_hien_tai - ?, thong_tin_rut_tien = ? WHERE ma_nguoi_dung = ?',
            [so_tien, thong_tin_nhan_tien, req.user.ma_nguoi_dung]
        );

        res.json({ success: true, message: 'Yêu cầu rút tiền của bạn đang được hệ thống xử lý' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};