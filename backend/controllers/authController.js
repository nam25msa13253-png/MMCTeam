const db = require('../config/db_connect');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Sử dụng bcryptjs để ổn định trên mọi môi trường
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'mmc_giatla_secret_key_2025';

// 1. Cấu hình gửi mail (Sử dụng Gmail và App Password của Tuấn)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nguyencongtuan2612@gmail.com',
        pass: 'abwysjawqqmhvtbn' 
    }
});

// Bộ nhớ tạm lưu OTP (Lưu ý: Nếu restart server, OTP này sẽ mất)
let otpStore = {};

/**
 * GỬI MÃ OTP
 */
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.toLowerCase().endsWith('@gmail.com')) {
            return res.status(400).json({ success: false, message: 'Hệ thống chỉ chấp nhận Gmail.' });
        }

        // Tạo mã 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Lưu vào store với thời hạn 5 phút
        otpStore[email] = { 
            code: otp, 
            expires: Date.now() + 5 * 60 * 1000 
        };

        const mailOptions = {
            from: '"Giặt Nhanh MMC 24H" <nguyencongtuan2612@gmail.com>',
            to: email,
            subject: 'Mã xác thực OTP đăng ký MMC 24H',
            html: `
                <div style="font-family: Arial, sans-serif; border: 1px solid #e2e8f0; padding: 25px; border-radius: 15px; max-width: 500px; margin: auto;">
                    <h2 style="color: #2563eb; text-align: center;">Xác thực tài khoản MMC 24H</h2>
                    <p>Chào bạn, mã OTP để đăng ký tài khoản của bạn là:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; color: #2563eb; background: #f0f7ff; padding: 10px 20px; border-radius: 8px; border: 1px solid #dbeafe; letter-spacing: 5px;">${otp}</span>
                    </div>
                    <p style="font-size: 13px; color: #64748b;">Mã có hiệu lực trong 5 phút. Vui lòng không cung cấp mã này cho bất kỳ ai.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Mã OTP đã được gửi về Gmail của bạn.' });
    } catch (error) {
        console.error("Lỗi gửi mail:", error);
        res.status(500).json({ success: false, message: 'Không thể gửi email: ' + error.message });
    }
};

/**
 * ĐĂNG KÝ TÀI KHOẢN
 */
const register = async (req, res) => {
    try {
        const { name, email, phone, password, otp, role } = req.body;

        // 1. Kiểm tra dữ liệu đầu vào
        if (!name || !email || !phone || !password || !otp) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc!' });
        }

        // 2. Xác thực OTP
        const cachedOTP = otpStore[email];
        if (!cachedOTP || cachedOTP.code !== otp) {
            return res.status(400).json({ success: false, message: 'Mã OTP không chính xác.' });
        }
        if (Date.now() > cachedOTP.expires) {
            return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn.' });
        }

        // 3. Kiểm tra trùng lặp Email hoặc SĐT trong bảng nguoi_dung
        const [existingUser] = await db.query(
            'SELECT * FROM nguoi_dung WHERE email = ? OR so_dien_thoai = ?', 
            [email, phone]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email hoặc Số điện thoại đã được sử dụng.' });
        }

        // 4. Mã hóa mật khẩu bảo mật
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Lưu vào bảng nguoi_dung (Khớp 100% với database.sql của Tuấn)
        const [result] = await db.query(
            'INSERT INTO nguoi_dung (ho_ten, email, so_dien_thoai, mat_khau_ma_hoa, vai_tro) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, hashedPassword, role || 'khach_hang']
        );

        const newUserId = result.insertId;

        // 6. Khởi tạo ví điện tử cho người dùng mới
        // Lưu ý: Đảm bảo bảng vi_dien_tu có cột ma_nguoi_dung và so_du_hien_tai
        await db.query(
            'INSERT INTO vi_dien_tu (ma_nguoi_dung, so_du_hien_tai) VALUES (?, 0)', 
            [newUserId]
        );

        // Xóa OTP khỏi bộ nhớ sau khi dùng xong
        delete otpStore[email];

        res.status(201).json({ success: true, message: 'Đăng ký thành công! Chào mừng bạn đến với MMC 24H.' });
        
    } catch (error) {
        // Log lỗi chi tiết ra console để debug khi làm backend
        console.error("CRITICAL ERROR DURING REGISTER:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server khi xử lý đăng ký.',
            error: error.sqlMessage || error.message 
        });
    }
};

/**
 * ĐĂNG NHẬP
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu!' });
        }

        const [users] = await db.query('SELECT * FROM nguoi_dung WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác.' });
        }

        const user = users[0];

        // Kiểm tra mật khẩu đã hash
        const isMatch = await bcrypt.compare(password, user.mat_khau_ma_hoa);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Tạo JWT Token
        const token = jwt.sign(
            { ma_nguoi_dung: user.ma_nguoi_dung, vai_tro: user.vai_tro }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            token: `Bearer ${token}`,
            user: { 
                id: user.ma_nguoi_dung, 
                name: user.ho_ten, 
                email: user.email, 
                role: user.vai_tro 
            }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập.' });
    }
};

/**
 * LẤY THÔNG TIN CÁ NHÂN (Dùng cho Dashboard)
 */
const getMe = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT ma_nguoi_dung as id, ho_ten as name, email, so_dien_thoai as phone, vai_tro as role, la_thanh_vien_premium FROM nguoi_dung WHERE ma_nguoi_dung = ?', 
            [req.user.ma_nguoi_dung]
        );
        
        if (users.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        
        res.json({ success: true, data: users[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
};

// Xuất các hàm ra để router sử dụng
module.exports = {
    sendOTP,
    register,
    login,
    getMe
};