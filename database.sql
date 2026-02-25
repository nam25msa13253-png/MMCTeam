-- CƠ SỞ DỮ LIỆU DỰ ÁN GIẶT NHANH 24H (MMC)
-- Phiên bản tối ưu cho MySQL/MariaDB (Sửa lỗi #1067)

-- Khởi tạo Database
CREATE DATABASE IF NOT EXISTS mmc_giatla;
USE mmc_giatla;

-- 1. BẢNG NGƯỜI DÙNG (nguoi_dung)
CREATE TABLE nguoi_dung (
    ma_nguoi_dung INT AUTO_INCREMENT PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    so_dien_thoai VARCHAR(20) UNIQUE NOT NULL,
    mat_khau_ma_hoa VARCHAR(255) NOT NULL,
    anh_dai_dien TEXT,
    vai_tro ENUM('khach_hang', 'chu_nha', 'quan_tri', 'nhan_vien') DEFAULT 'khach_hang',
    dang_hoat_dong BOOLEAN DEFAULT TRUE,
    la_thanh_vien_premium BOOLEAN DEFAULT FALSE,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO nguoi_dung (ho_ten, email, so_dien_thoai, mat_khau_ma_hoa, vai_tro, la_thanh_vien_premium) VALUES
('Nguyễn Công Tuấn', 'tuan.admin@mmc.vn', '0986317275', 'hash_pw_1', 'quan_tri', true),
('Lưu Thị Kim Liên', 'lien.host@gmail.com', '0912345678', 'hash_pw_2', 'chu_nha', false),
('Nguyễn Hữu Duy', 'duy.host@gmail.com', '0988777666', 'hash_pw_3', 'chu_nha', false),
('Lê Văn An', 'an.student@hht.edu.vn', '0345678901', 'hash_pw_4', 'khach_hang', true),
('Kiều Quý Duy', 'duy.customer@gmail.com', '0355444333', 'hash_pw_5', 'khach_hang', false),
('Trần Văn B', 'host_cau_giay@gmail.com', '0901234567', 'hash_pw_6', 'chu_nha', false),
('Phạm Thị C', 'host_hht@gmail.com', '0907654321', 'hash_pw_7', 'chu_nha', false),
('Hoàng Văn D', 'host_ba_dinh@gmail.com', '0911223344', 'hash_pw_8', 'chu_nha', false);

-- 2. BẢNG HỒ SƠ CHỦ NHÀ (ho_so_chu_nha)
CREATE TABLE ho_so_chu_nha (
    ma_chu_nha INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT,
    dia_chi_chi_tiet TEXT NOT NULL,
    vi_do DECIMAL(10, 8),
    kinh_do DECIMAL(11, 8),
    thong_tin_may_giat JSON,
    loai_nuoc_giat_xa TEXT,
    diem_danh_gia_tb DECIMAL(3, 2) DEFAULT 0.00,
    trang_thai_hoat_dong ENUM('dang_online', 'dang_ban', 'dang_offline') DEFAULT 'dang_online',
    da_xac_minh_danh_tinh BOOLEAN DEFAULT FALSE,
    ngay_ve_sinh_long_giat_gan_nhat DATE,
    gioi_thieu_ban_than TEXT,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE CASCADE
);

INSERT INTO ho_so_chu_nha (ma_nguoi_dung, dia_chi_chi_tiet, vi_do, kinh_do, thong_tin_may_giat, loai_nuoc_giat_xa, diem_danh_gia_tb, trang_thai_hoat_dong, da_xac_minh_danh_tinh, ngay_ve_sinh_long_giat_gan_nhat, gioi_thieu_ban_than) VALUES
(2, 'Số 15, Ngõ 123 Cầu Giấy, Hà Nội', 21.0365, 105.7950, '{"hang": "LG", "khoi_luong": "9kg", "loai": "Cửa ngang"}', 'Omo Comfort', 4.8, 'dang_online', true, '2025-01-20', 'Chủ nhà nhiệt tình, gần ĐH Sư Phạm.'),
(3, 'Ngách 2/45 Tây Mỗ, Nam Từ Liêm', 21.0050, 105.7430, '{"hang": "Samsung", "khoi_luong": "10kg", "loai": "Cửa trên"}', 'Ariel Downy', 4.5, 'dang_online', true, '2025-01-25', 'Máy giặt mới, sấy khô nhanh chóng.'),
(6, 'Số 8, Ngõ 10 Phan Văn Trường', 21.0400, 105.7850, '{"hang": "Toshiba", "khoi_luong": "8kg", "loai": "Cửa ngang"}', 'Surf', 4.2, 'dang_ban', true, '2025-01-15', 'Gần chợ dân sinh, thuận tiện lấy đồ.'),
(7, 'Phòng 402, Chung cư HHT', 21.0100, 105.7500, '{"hang": "Panasonic", "khoi_luong": "9kg", "loai": "Cửa ngang"}', 'Omo Matic', 4.9, 'dang_online', true, '2025-01-28', 'Ưu tiên sinh viên trường HHT.'),
(8, 'Số 20 Đội Cấn, Ba Đình', 21.0330, 105.8280, '{"hang": "Electrolux", "khoi_luong": "11kg", "loai": "Cửa ngang"}', 'Comfort tinh dầu thơm', 5.0, 'dang_online', true, '2025-01-01', 'Chuyên giặt đồ hiệu và áo khoác lớn.');

-- 3. BẢNG DANH MỤC GÓI DỊCH VỤ (danh_muc_goi)
CREATE TABLE danh_muc_goi (
    ma_goi INT AUTO_INCREMENT PRIMARY KEY,
    ten_goi VARCHAR(50) NOT NULL,
    gia_tien DECIMAL(15, 2) NOT NULL,
    thoi_han_ngay INTEGER NOT NULL,
    mo_ta_quyen_loi TEXT,
    cac_tinh_nang_dac_biet JSON,
    dang_kich_hoat BOOLEAN DEFAULT TRUE,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO danh_muc_goi (ten_goi, gia_tien, thoi_han_ngay, mo_ta_quyen_loi, cac_tinh_nang_dac_biet) VALUES
('Premium Tháng', 120000, 30, 'Ưu tiên đặt lịch, miễn phí vận chuyển 2km', '{"free_ship": true, "uu_tien": true}'),
('Premium Học Kỳ', 500000, 150, 'Gói dành riêng cho sinh viên, giá rẻ hơn 20%', '{"free_ship": true, "uu_tien": true, "giam_gia": 0.2}'),
('Gói Siêu Cấp VIP', 1000000, 365, 'Giặt sấy không giới hạn, hỗ trợ riêng 24/7', '{"free_ship": true, "uu_tien": true, "support_vip": true}'),
('Gói Dùng Thử', 20000, 7, 'Trải nghiệm tính năng Premium trong 7 ngày', '{"free_ship": false, "uu_tien": true}'),
('Premium Đồng Đội', 300000, 30, 'Dành cho nhóm 3 người cùng sử dụng', '{"shared_users": 3, "free_ship": true}');

-- 4. BẢNG ĐĂNG KÝ GÓI (dang_ky_goi)
CREATE TABLE dang_ky_goi (
    ma_dang_ky INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT,
    ma_goi INT,
    ngay_bat_dau DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_ket_thuc DATETIME NOT NULL,
    trang_thai_goi ENUM('dang_dung', 'het_han', 'da_huy') DEFAULT 'dang_dung',
    tu_dong_gia_han BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung),
    FOREIGN KEY (ma_goi) REFERENCES danh_muc_goi(ma_goi)
);

INSERT INTO dang_ky_goi (ma_nguoi_dung, ma_goi, ngay_bat_dau, ngay_ket_thuc, trang_thai_goi) VALUES
(1, 3, '2025-01-01 00:00:00', '2026-01-01 00:00:00', 'dang_dung'),
(4, 2, '2025-01-15 00:00:00', '2025-06-15 00:00:00', 'dang_dung'),
(5, 1, '2024-12-01 00:00:00', '2025-01-01 00:00:00', 'het_han'),
(4, 1, '2024-11-01 00:00:00', '2024-12-01 00:00:00', 'het_han'),
(1, 4, '2025-02-01 00:00:00', '2025-02-08 00:00:00', 'dang_dung');

-- 5. BẢNG DỊCH VỤ GIẶT LẺ (dich_vu)
CREATE TABLE dich_vu (
    ma_dich_vu INT AUTO_INCREMENT PRIMARY KEY,
    ten_dich_vu VARCHAR(100),
    gia_co_ban_moi_kg DECIMAL(10, 2),
    mo_ta_chi_tiet TEXT
);

INSERT INTO dich_vu (ten_dich_vu, gia_co_ban_moi_kg, mo_ta_chi_tiet) VALUES
('Giặt thường (Phơi)', 12000, 'Giặt sạch, xả thơm và phơi khô tự nhiên.'),
('Giặt sấy nhanh', 25000, 'Giặt sạch và sấy khô bằng máy, lấy sau 2h.'),
('Giặt chăn màn', 35000, 'Xử lý các loại chăn bông, màn lớn cồng kềnh.'),
('Giặt giày thể thao', 40000, 'Vệ sinh tay và khử mùi cho giày.'),
('Giặt đồ len/lụa', 30000, 'Chế độ giặt nhẹ nhàng bảo vệ sợi vải.');

-- 6. BẢNG ĐƠN HÀNG (don_hang)
CREATE TABLE don_hang (
    ma_don_hang INT AUTO_INCREMENT PRIMARY KEY,
    ma_khach_hang INT,
    ma_chu_nha INT,
    trang_thai_don_hang ENUM('cho_xac_nhan', 'da_xac_nhan', 'dang_lay_do', 'dang_giat', 'dang_phoi_say', 'da_giat_xong', 'dang_giao_tra', 'hoan_thanh', 'da_huy') DEFAULT 'cho_xac_nhan',
    khoi_luong_kg DECIMAL(5, 2),
    tong_tien_khach_tra DECIMAL(15, 2),
    tien_hoa_hong_mmc DECIMAL(15, 2),
    yeu_cau_nuoc_giat_xa VARCHAR(100),
    ghi_chu_dac_biet TEXT,
    anh_doi_chieu_truoc_giat TEXT,
    anh_doi_chieu_sau_giat TEXT,
    dia_chi_lay_do TEXT,
    dia_chi_tra_do TEXT,
    ngay_tao_don DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_hoan_thanh DATETIME,
    FOREIGN KEY (ma_khach_hang) REFERENCES nguoi_dung(ma_nguoi_dung),
    FOREIGN KEY (ma_chu_nha) REFERENCES ho_so_chu_nha(ma_chu_nha)
);

INSERT INTO don_hang (ma_khach_hang, ma_chu_nha, trang_thai_don_hang, khoi_luong_kg, tong_tien_khach_tra, tien_hoa_hong_mmc, yeu_cau_nuoc_giat_xa, dia_chi_lay_do, dia_chi_tra_do) VALUES
(4, 1, 'hoan_thanh', 5.0, 60000, 9000, 'Omo đỏ', 'KTX HHT, phòng 302', 'KTX HHT, phòng 302'),
(5, 2, 'dang_giat', 3.5, 87500, 13125, 'Downy huyền bí', 'Số 2 Tây Mỗ', 'Số 2 Tây Mỗ'),
(4, 4, 'da_xac_nhan', 7.0, 84000, 12600, 'Ariel matic', 'Chung cư HHT', 'Chung cư HHT'),
(5, 5, 'cho_xac_nhan', 10.0, 350000, 52500, 'Comfort', 'Khách sạn Daewoo', 'Khách sạn Daewoo'),
(1, 1, 'hoan_thanh', 2.0, 24000, 3600, 'Omo', 'Cầu Giấy', 'Cầu Giấy');

-- 7. BẢNG THÔNG BÁO (thong_bao)
CREATE TABLE thong_bao (
    ma_thong_bao INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT,
    tieu_de VARCHAR(255) NOT NULL,
    noi_dung TEXT NOT NULL,
    loai_thong_bao ENUM('cap_nhat_don_hang', 'thanh_toan', 'canh_bao_he_thong', 'khuyen_mai') DEFAULT 'canh_bao_he_thong',
    da_doc BOOLEAN DEFAULT FALSE,
    duong_dan_hanh_dong TEXT,
    ngay_gui DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung)
);

INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai_thong_bao) VALUES
(4, 'Đơn hàng đã hoàn thành', 'Quần áo của bạn đã được giặt xong và đang được giao.', 'cap_nhat_don_hang'),
(2, 'Bạn có đơn hàng mới', 'Khách hàng Lê Văn An vừa đặt lịch giặt 5kg.', 'cap_nhat_don_hang'),
(5, 'Thanh toán thành công', 'Bạn đã thanh toán 87.500đ qua ví Momo.', 'thanh_toan'),
(1, 'Hệ thống bảo trì', 'MMC sẽ bảo trì từ 2h-4h sáng mai.', 'canh_bao_he_thong'),
(4, 'Khuyến mãi cực hot', 'Giảm 50% cho đơn hàng đầu tiên trong tháng 2.', 'khuyen_mai');

-- 8. BẢNG NHẬT KÝ AI MATCHING (nhat_ky_ai_matching)
CREATE TABLE nhat_ky_ai_matching (
    ma_nhat_ky INT AUTO_INCREMENT PRIMARY KEY,
    ma_khach_hang INT,
    danh_sach_chu_nha_goi_y JSON,
    ma_chu_nha_duoc_chon INT,
    diem_phu_hop DECIMAL(5, 2),
    ngay_thuc_hien DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_khach_hang) REFERENCES nguoi_dung(ma_nguoi_dung),
    FOREIGN KEY (ma_chu_nha_duoc_chon) REFERENCES ho_so_chu_nha(ma_chu_nha)
);

INSERT INTO nhat_ky_ai_matching (ma_khach_hang, danh_sach_chu_nha_goi_y, ma_chu_nha_duoc_chon, diem_phu_hop) VALUES
(4, '[1, 3, 4]', 1, 0.95),
(5, '[2, 5]', 2, 0.88),
(4, '[4, 1]', 4, 0.92),
(1, '[1, 2, 3, 4, 5]', 1, 0.99),
(5, '[5]', 5, 0.75);

-- 9. BẢNG ĐÁNH GIÁ (danh_gia)
CREATE TABLE danh_gia (
    ma_danh_gia INT AUTO_INCREMENT PRIMARY KEY,
    ma_don_hang INT,
    ma_khach_hang INT,
    ma_chu_nha INT,
    so_sao INTEGER CHECK (so_sao >= 1 AND so_sao <= 5),
    binh_luan TEXT,
    ngay_danh_gia DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_don_hang) REFERENCES don_hang(ma_don_hang),
    FOREIGN KEY (ma_khach_hang) REFERENCES nguoi_dung(ma_nguoi_dung),
    FOREIGN KEY (ma_chu_nha) REFERENCES ho_so_chu_nha(ma_chu_nha)
);

INSERT INTO danh_gia (ma_don_hang, ma_khach_hang, ma_chu_nha, so_sao, binh_luan) VALUES
(1, 4, 1, 5, 'Giặt rất thơm và sạch, cô chủ nhiệt tình.'),
(5, 1, 1, 4, 'Tốc độ nhanh, nhưng cần gấp đồ gọn hơn tí nữa.'),
(1, 4, 1, 5, 'Rất hài lòng với dịch vụ.'),
(1, 4, 1, 3, 'Hơi lâu một chút nhưng đồ sạch.'),
(5, 1, 1, 5, 'Tuyệt vời!');

-- 10. BẢNG THANH TOÁN (thanh_toan)
CREATE TABLE thanh_toan (
    ma_thanh_toan INT AUTO_INCREMENT PRIMARY KEY,
    ma_don_hang INT,
    phuong_thuc_thanh_toan ENUM('vnpay', 'momo', 'zalopay', 'vi_noi_bo', 'tien_mat'),
    ma_giao_dich_cong_ngoai VARCHAR(100),
    so_tien DECIMAL(15, 2) NOT NULL,
    trang_thai_thanh_toan ENUM('dang_cho', 'thanh_cong', 'that_bai', 'da_hoan_tien') DEFAULT 'dang_cho',
    ngay_giao_dich DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_don_hang) REFERENCES don_hang(ma_don_hang)
);

INSERT INTO thanh_toan (ma_don_hang, phuong_thuc_thanh_toan, ma_giao_dich_cong_ngoai, so_tien, trang_thai_thanh_toan) VALUES
(1, 'momo', 'MOMO123456', 60000, 'thanh_cong'),
(2, 'vnpay', 'VNPay987', 87500, 'thanh_cong'),
(3, 'vi_noi_bo', 'MMC_WALLET_01', 84000, 'thanh_cong'),
(4, 'tien_mat', NULL, 350000, 'dang_cho'),
(5, 'zalopay', 'ZALO_AAABBB', 24000, 'thanh_cong');

-- 11. BẢNG KHIẾU NẠI (khieu_nai)
CREATE TABLE khieu_nai (
    ma_khieu_nai INT AUTO_INCREMENT PRIMARY KEY,
    ma_don_hang INT,
    ma_nguoi_bao INT,
    ly_do TEXT NOT NULL,
    hinh_anh_bang_chung JSON,
    trang_thai_xu_ly ENUM('moi_tiep_nhan', 'dang_dieu_tra', 'da_giai_quyet', 'da_boi_thuong') DEFAULT 'moi_tiep_nhan',
    ghi_chu_cua_admin TEXT,
    ngay_khieu_nai DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_don_hang) REFERENCES don_hang(ma_don_hang),
    FOREIGN KEY (ma_nguoi_bao) REFERENCES nguoi_dung(ma_nguoi_dung)
);

INSERT INTO khieu_nai (ma_don_hang, ma_nguoi_bao, ly_do, hinh_anh_bang_chung, trang_thai_xu_ly) VALUES
(1, 4, 'Mất một chiếc tất màu xanh.', '["link_anh_1"]', 'da_giai_quyet'),
(2, 5, 'Áo trắng bị loang màu từ đồ khác.', '["link_anh_2", "link_anh_3"]', 'dang_dieu_tra'),
(3, 4, 'Chủ nhà giao đồ trễ 3 tiếng.', '[]', 'da_giai_quyet'),
(4, 5, 'Đồ vẫn còn mùi ẩm.', '[]', 'moi_tiep_nhan'),
(5, 1, 'Nút áo bị hỏng sau khi giặt.', '["link_anh_4"]', 'da_boi_thuong');

-- 12. BẢNG VÍ ĐIỆN TỬ (vi_dien_tu)
CREATE TABLE vi_dien_tu (
    ma_vi INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT,
    so_du_hien_tai DECIMAL(15, 2) DEFAULT 0.00,
    thong_tin_rut_tien TEXT,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung)
);

INSERT INTO vi_dien_tu (ma_nguoi_dung, so_du_hien_tai, thong_tin_rut_tien) VALUES
(1, 5000000, 'Admin account'),
(2, 1250000, 'Vietcombank 001100...'),
(3, 890000, 'Agribank 1500...'),
(4, 50000, 'Sử dụng để thanh toán đơn lẻ'),
(6, 2100000, 'Momo 0901234567');

-- CHỈ MỤC TĂNG TỐC TRUY VẤN
CREATE INDEX idx_vi_tri_chu_nha ON ho_so_chu_nha(vi_do, kinh_do);
CREATE INDEX idx_trang_thai_don ON don_hang(trang_thai_don_hang);
CREATE INDEX idx_thong_bao_chua_doc ON thong_bao(ma_nguoi_dung, da_doc);
CREATE INDEX idx_goi_dang_dung ON dang_ky_goi(ma_nguoi_dung, trang_thai_goi);
-- 1. ĐẢM BẢO BẢNG LỊCH SỬ TRẠNG THÁI ĐÃ TỒN TẠI (Dùng cho Tracking)
CREATE TABLE IF NOT EXISTS lich_su_trang_thai_don (
    ma_lich_su INT AUTO_INCREMENT PRIMARY KEY,
    ma_don_hang INT NOT NULL,
    trang_thai_moi ENUM('cho_xac_nhan', 'da_xac_nhan', 'dang_lay_do', 'dang_giat', 'dang_phoi_say', 'da_giat_xong', 'dang_giao_tra', 'hoan_thanh', 'da_huy') NOT NULL,
    thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP,
    ma_nguoi_thuc_hien INT, 
    ghi_chu_chi_tiet TEXT,
    FOREIGN KEY (ma_don_hang) REFERENCES don_hang(ma_don_hang) ON DELETE CASCADE,
    FOREIGN KEY (ma_nguoi_thuc_hien) REFERENCES nguoi_dung(ma_nguoi_dung)
);

-- 2. TẠO VIEW TỔNG HỢP ĐƠN HÀNG (Dành cho Admin xem tất cả)
-- View này giúp Admin xem toàn bộ thông tin: Ai đặt, Ai giặt, Trạng thái gì mà không cần viết JOIN phức tạp.
CREATE OR REPLACE VIEW view_quan_ly_tat_ca_don AS
SELECT 
    d.ma_don_hang,
    d.ngay_tao_don,
    kh.ho_ten AS ten_khach_hang,
    kh.so_dien_thoai AS sdt_khach,
    kh.ma_nguoi_dung AS ma_khach_hang,
    cn_user.ho_ten AS ten_chu_nha,
    d.khoi_luong_kg,
    d.tong_tien_khach_tra,
    d.trang_thai_don_hang,
    d.yeu_cau_nuoc_giat_xa
FROM don_hang d
JOIN nguoi_dung kh ON d.ma_khach_hang = kh.ma_nguoi_dung
JOIN ho_so_chu_nha hscn ON d.ma_chu_nha = hscn.ma_chu_nha
JOIN nguoi_dung cn_user ON hscn.ma_nguoi_dung = cn_user.ma_nguoi_dung;

-- 3. HƯỚNG DẪN CÁCH TRUY VẤN THEO QUYỀN (Sử dụng trong Code Backend)

/* DÀNH CHO ADMIN: Xem tất cả các đơn hàng trong hệ thống
   Query: SELECT * FROM view_quan_ly_tat_ca_don ORDER BY ngay_tao_don DESC;
*/

/* DÀNH CHO KHÁCH HÀNG: Chỉ lọc những đơn do chính mình đặt
   Query (Giả sử mã khách hàng đang đăng nhập là 4):
   SELECT * FROM view_quan_ly_tat_ca_don 
   WHERE ma_khach_hang = 4 
   ORDER BY ngay_tao_don DESC;
*/

-- 4. TRIGGER TỰ ĐỘNG CẬP NHẬT LỊCH SỬ KHI TRẠNG THÁI ĐƠN HÀNG THAY ĐỔI
-- Mỗi khi bạn UPDATE bảng don_hang, bảng lich_su_trang_thai_don sẽ tự động nhảy thêm 1 dòng.
DELIMITER //
CREATE TRIGGER after_order_status_update
AFTER UPDATE ON don_hang
FOR EACH ROW
BEGIN
    IF OLD.trang_thai_don_hang <> NEW.trang_thai_don_hang THEN
        INSERT INTO lich_su_trang_thai_don (ma_don_hang, trang_thai_moi, ghi_chu_chi_tiet)
        VALUES (NEW.ma_don_hang, NEW.trang_thai_don_hang, CONCAT('Trạng thái chuyển từ ', OLD.trang_thai_don_hang, ' sang ', NEW.trang_thai_don_hang));
    END IF;
END;
//
DELIMITER ;