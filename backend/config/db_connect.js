const mysql = require('mysql2');
// Sử dụng thư viện mysql2 để kết nối MySQL với hiệu suất cao (Note CTuấn)
require('dotenv').config();
// Sử dụng dotenv để bảo mật thông tin tài khoản thông qua biến môi trường (Note CTuấn)

/**
 * Cấu hình kết nối Pool (Hàng đợi kết nối)
 * Giúp ứng dụng không bị quá tải khi có nhiều yêu cầu cùng lúc
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // Địa chỉ máy chủ database (Note CTuấn)
    user: process.env.DB_USER || 'root',      // Tài khoản đăng nhập MySQL (Note CTuấn)
    password: process.env.DB_PASSWORD || '',  // Mật khẩu (thường để trống nếu dùng XAMPP) (Note CTuấn)
    database: process.env.DB_NAME || 'mmc_giatla', // Tên database đã tạo trong file SQL (Note CTuấn)
    port: process.env.DB_PORT || 3306,        // Cổng mặc định của MySQL là 3306 (Note CTuấn)
    waitForConnections: true,                 // Chờ nếu hàng đợi đã đầy (Note CTuấn)
    connectionLimit: 20,                      // Giới hạn tối đa 20 kết nối đồng thời (Note CTuấn)
    queueLimit: 0                             // Không giới hạn số lượng yêu cầu trong hàng đợi (Note CTuấn)
});

// Chuyển đổi sang dạng Promise để sử dụng async/await dễ dàng hơn (Note CTuấn)
const db = pool.promise();

/**
 * Hàm kiểm tra kết nối khi khởi động ứng dụng
 */
const testConnection = async () => {
    try {
        const connection = await db.getConnection(); // Thử lấy một kết nối từ pool (Note CTuấn)
        console.log('✅ KẾT NỐI ĐẾN DATABASE "mmc_giatla" THÀNH CÔNG!'); 
        connection.release(); // Trả kết nối lại cho pool để tái sử dụng (Note CTuấn)
    } catch (error) {
        console.error('❌ KẾT NỐI DATABASE THẤT BẠI:', error.message);
        console.error('--> Hướng xử lý: Kiểm tra XAMPP/MySQL đã bật chưa và cấu hình trong file .env (Note CTuấn)');
    }
};

// Thực hiện kiểm tra ngay khi load file (Note CTuấn)
testConnection();

module.exports = db;