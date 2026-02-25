const db = require('../config/db_connect');

/**
 * 1. Khởi tạo giao dịch thanh toán (Note CTuấn)
 */
exports.createPaymentIntent = async (req, res) => {
    try {
        const { ma_don_hang, phuong_thuc_thanh_toan, so_tien } = req.body;

        // 1. Tạo bản ghi thanh toán với trạng thái 'dang_cho'
        const [result] = await db.query(
            'INSERT INTO thanh_toan (ma_don_hang, phuong_thuc_thanh_toan, so_tien, trang_thai_thanh_toan) VALUES (?, ?, ?, "dang_cho")',
            [ma_don_hang, phuong_thuc_thanh_toan, so_tien]
        );

        // 2. Logic giả lập: Nếu thanh toán qua ví nội bộ, kiểm tra số dư và trừ tiền luôn
        if (phuong_thuc_thanh_toan === 'vi_noi_bo') {
            const [wallet] = await db.query('SELECT so_du_hien_tai FROM vi_dien_tu WHERE ma_nguoi_dung = ?', [req.user.ma_nguoi_dung]);
            
            if (wallet[0].so_du_hien_tai < so_tien) {
                return res.status(400).json({ success: false, message: 'Số dư ví không đủ' });
            }

            // Trừ tiền ví và cập nhật thanh toán thành công
            await db.query('UPDATE vi_dien_tu SET so_du_hien_tai = so_du_hien_tai - ? WHERE ma_nguoi_dung = ?', [so_tien, req.user.ma_nguoi_dung]);
            await db.query('UPDATE thanh_toan SET trang_thai_thanh_toan = "thanh_cong" WHERE ma_thanh_toan = ?', [result.insertId]);
            
            return res.json({ success: true, message: 'Thanh toán qua ví thành công', ma_thanh_toan: result.insertId });
        }

        // Với VNPay/Momo: Trả về thông tin để Frontend mở cổng thanh toán
        res.json({ 
            success: true, 
            message: 'Đã khởi tạo yêu cầu thanh toán', 
            ma_thanh_toan: result.insertId,
            huong_dan: 'Vui lòng thực hiện quét mã QR để hoàn tất' 
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * 2. Xem lịch sử thanh toán cá nhân
 */
exports.getPaymentHistory = async (req, res) => {
    try {
        const query = `
            SELECT t.*, d.ma_don_hang, d.ngay_tao_don
            FROM thanh_toan t
            JOIN don_hang d ON t.ma_don_hang = d.ma_don_hang
            WHERE d.ma_khach_hang = ? OR d.ma_chu_nha = (SELECT ma_chu_nha FROM ho_so_chu_nha WHERE ma_nguoi_dung = ?)
            ORDER BY t.ngay_giao_dich DESC
        `;
        const [rows] = await db.query(query, [req.user.ma_nguoi_dung, req.user.ma_nguoi_dung]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * 3. Xử lý phản hồi từ cổng thanh toán (Webhook)
 */
exports.handleWebhook = async (req, res) => {
    try {
        const { ma_giao_dich_ngoai, ma_thanh_toan, ket_qua } = req.body;
        
        const trang_thai = ket_qua === 'success' ? 'thanh_cong' : 'that_bai';

        await db.query(
            'UPDATE thanh_toan SET trang_thai_thanh_toan = ?, ma_giao_dich_cong_ngoai = ? WHERE ma_thanh_toan = ?',
            [trang_thai, ma_giao_dich_ngoai, ma_thanh_toan]
        );

        res.json({ success: true, message: 'Đã cập nhật trạng thái giao dịch' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};