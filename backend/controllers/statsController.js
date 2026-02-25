const db = require('../config/db_connect');

// Thống kê tổng quan cho quản trị viên (Admin Dashboard)
exports.getOverview = async (req, res) => {
    try {
        // Tối ưu: Chạy song song nhiều câu lệnh truy vấn
        const [countUsers] = await db.query('SELECT COUNT(*) as tong FROM nguoi_dung');
        const [countHosts] = await db.query('SELECT COUNT(*) as tong FROM ho_so_chu_nha');
        const [orderStats] = await db.query(`
            SELECT 
                COUNT(*) as tong_don, 
                SUM(tong_tien_khach_tra) as doanh_thu,
                SUM(tien_hoa_hong_mmc) as loi_nhuan_mmc
            FROM don_hang 
            WHERE trang_thai_don_hang = 'hoan_thanh'
        `);

        res.json({
            success: true,
            data: {
                nguoi_dung: countUsers[0].tong,
                chu_nha: countHosts[0].tong,
                don_hang_thanh_cong: orderStats[0].tong_don || 0,
                tong_doanh_thu: orderStats[0].doanh_thu || 0,
                loi_nhuan_mmc: orderStats[0].loi_nhuan_mmc || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};