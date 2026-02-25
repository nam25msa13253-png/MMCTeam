const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Cấu hình biến môi trường
dotenv.config();

// 2. Khởi tạo ứng dụng Express (Phải khởi tạo app trước khi sử dụng middleware)
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Cấu hình Middleware
// Sử dụng cấu hình CORS chi tiết từ code cũ của bạn
app.use(cors({
    origin: '*', // Trong môi trường dev để * cho tiện, production nên giới hạn domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Khai báo các Routes (Đường dẫn API)
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Route trang chủ (Health check)
app.get('/', (req, res) => {
    res.send('🚀 Backend Giặt Nhanh 24H (MMC) đang chạy ổn định tại 127.0.0.1!');
});

// 5. Khởi động server
app.listen(PORT, () => {
    console.log(`===========================================================`);
    console.log(`🚀 SERVER: http://127.0.0.1:${PORT}`);
    console.log(`📡 API: http://127.0.0.1:${PORT}/api`);
    console.log(`🏠 DỰ ÁN: Giặt Nhanh 24H (MMC)`);
    console.log(`===========================================================`);
});