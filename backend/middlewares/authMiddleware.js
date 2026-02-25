const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực Token (Kiểm tra xem đã đăng nhập chưa)
 */
const xacThucToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Bạn cần đăng nhập để truy cập tính năng này'
        });
    }

    try {
        const cleanToken = token.replace('Bearer ', '');
        // Giải mã token lấy ma_nguoi_dung và vai_tro
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || 'mmc_giatla_secret_key_2025');
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Phiên làm việc hết hạn, vui lòng đăng nhập lại'
        });
    }
};

/**
 * Middleware phân quyền (Kiểm tra xem có đúng vai trò không)
 * @param {Array} cacVaiTroDuocPhep - Danh sách các vai trò có quyền truy cập
 */
const phanQuyen = (cacVaiTroDuocPhep) => {
    return (req, res, next) => {
        // Kiểm tra vai_tro trong token giải mã có nằm trong danh sách cho phép không
        if (!req.user || !cacVaiTroDuocPhep.includes(req.user.vai_tro)) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập vào khu vực này'
            });
        }
        next();
    };
};

module.exports = { xacThucToken, phanQuyen };