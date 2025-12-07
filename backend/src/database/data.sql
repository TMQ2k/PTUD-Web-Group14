INSERT INTO products (
    seller_id, name, description, starting_price, step_price, current_price,
    image_cover_url, is_active, created_at, end_time
)
VALUES
(NULL, 'Apple iPhone 12 64GB', 'Điện thoại iPhone 12 màu đen, còn mới 95%', 8000000, 100000, 8200000, 'https://example.com/iphone12.jpg', TRUE, NOW() - INTERVAL '10 days', '2025-12-10 23:59:59'),

(NULL, 'Laptop Dell XPS 13', 'Laptop Dell XPS 13 core i7, 16GB RAM', 15000000, 200000, 15000000, 'https://example.com/dellxps13.jpg', TRUE, NOW() - INTERVAL '12 days', '2025-12-05 23:59:59'),

(NULL, 'Sony WH-1000XM4', 'Tai nghe chống ồn Sony XM4', 4500000, 50000, 4500000, 'https://example.com/sonyxm4.jpg', TRUE, NOW() - INTERVAL '7 days', '2025-12-05 23:59:59'),

(NULL, 'Nintendo Switch OLED', 'Máy chơi game Nintendo Switch OLED bản trắng', 7000000, 100000, 7100000, 'https://example.com/switch.jpg', TRUE, NOW() - INTERVAL '8 days', '2025-12-05 23:59:59'),

(NULL, 'Apple Watch Series 7', 'Apple Watch S7 45mm GPS', 6000000, 100000, 6000000, 'https://example.com/applewatch7.jpg', TRUE, NOW() - INTERVAL '15 days', '2025-12-05 23:59:59'),

(NULL, 'Chuột Logitech MX Master 3', 'Chuột không dây cao cấp Logitech MX Master 3', 1800000, 20000, 1800000, 'https://example.com/mx3.jpg', TRUE, NOW() - INTERVAL '5 days', '2025-12-05 23:59:59'),

(NULL, 'Bàn phím Keychron K6', 'Bàn phím cơ Keychron K6 RGB, switch brown', 2200000, 30000, 2200000, 'https://example.com/k6.jpg', TRUE, NOW() - INTERVAL '9 days', '2025-12-05 23:59:59'),

(NULL, 'Camera Canon EOS M50', 'Canon EOS M50 kèm lens kit 15-45mm', 9000000, 150000, 9000000, 'https://example.com/m50.jpg', TRUE, NOW() - INTERVAL '20 days', '2025-12-05 23:59:59'),

(NULL, 'Ghế công thái học Sihoo M18', 'Ghế công thái học Sihoo M18 chính hãng', 3000000, 50000, 3000000, 'https://example.com/sihoo.jpg', TRUE, NOW() - INTERVAL '3 days', '2025-12-05 23:59:59'),

(NULL, 'Màn hình LG Ultrawide 29"', 'Màn hình LG 29 inch ultrawide, 75Hz', 4500000, 80000, 4500000, 'https://example.com/lg29.jpg', TRUE, NOW() - INTERVAL '6 days', '2025-12-05 23:59:59');

INSERT INTO products 
(name, description, starting_price, step_price, current_price, image_cover_url, end_time)
VALUES
('Đồng hồ cơ Orient Bambino', 
 'Đồng hồ cơ tự động chính hãng Orient Bambino, mặt kính cong cổ điển, dây da nâu.', 
 3500000, 50000, 3500000, 
 'https://example.com/images/orient-bambino.jpg', 
 NOW() + INTERVAL '7 days'),

('Laptop Dell XPS 13', 
 'Laptop cao cấp Dell XPS 13, CPU i7 Gen 12, RAM 16GB, SSD 512GB, màn hình InfinityEdge.', 
 25000000, 200000, 25000000, 
 'https://example.com/images/dell-xps13.jpg', 
 NOW() + INTERVAL '5 days'),

( 'Điện thoại iPhone 14 Pro 128GB', 
 'iPhone 14 Pro 128GB, màu Deep Purple, hàng chính hãng VN/A, còn bảo hành 8 tháng.', 
 22000000, 100000, 22000000, 
 'https://example.com/images/iphone14pro.jpg', 
 NOW() + INTERVAL '10 days'),

('Máy ảnh Canon EOS M50 Mark II', 
 'Máy ảnh Canon EOS M50 Mark II kèm lens kit 15-45mm, phù hợp cho vlog và livestream.', 
 15000000, 100000, 15000000, 
 'https://example.com/images/canon-m50m2.jpg', 
 NOW() + INTERVAL '3 days'),

('Giày Nike Air Force 1 Trắng', 
 'Giày sneaker Nike Air Force 1 White, size 42, hàng chính hãng Nike Store.', 
 2500000, 50000, 2500000, 
 'https://example.com/images/nike-af1.jpg', 
 NOW() + INTERVAL '6 days');

INSERT INTO categories (name, parent_id) VALUES
('Điện tử', NULL),                     -- 1
('Thời trang', NULL),                  -- 2
('Đồ gia dụng', NULL),                 -- 3
('Thể thao & Dã ngoại', NULL),         -- 4
('Sách & Văn phòng phẩm', NULL),       -- 5
('Đồng hồ', 1),                        -- 6 - con của Điện tử
('Điện thoại', 1),                     -- 7 - con của Điện tử
('Laptop & Máy tính', 1),              -- 8 - con của Điện tử
('Giày dép', 2),                       -- 9 - con của Thời trang
('Máy ảnh & Thiết bị quay phim', 1);   -- 10 - con của Điện tử

INSERT INTO product_categories (product_id, category_id) VALUES
-- Đồng hồ cơ Orient Bambino → thuộc nhóm Đồng hồ (6)
(1, 6),

-- Laptop Dell XPS 13 → thuộc nhóm Laptop & Máy tính (8)
(2, 8),

-- Điện thoại iPhone 14 Pro → thuộc nhóm Điện thoại (7)
(3, 7),

-- Máy ảnh Canon EOS M50 Mark II → thuộc nhóm Máy ảnh & Thiết bị quay phim (10)
(4, 10),

-- Giày Nike Air Force 1 → thuộc nhóm Giày dép (9) và có thể là Thể thao & Dã ngoại (4)
(5, 9),
(5, 4);

-- Thêm dữ liệu mẫu vào bảng bids
INSERT INTO bids (product_id, user_id, amount, bid_time, status, created_at)
VALUES
    (1, 7, 6000000.00, '2025-11-12T18:46:18.065Z', 'active', NOW()),  -- Người "Kha" ra giá 6,000,000 cho sản phẩm ID 1
    (1, 6, 5000000.00, '2025-11-12T18:46:18.065Z', 'active', NOW()),  -- Người "Kha" ra giá 5,000,000 cho sản phẩm ID 1
    (1, 8, 3600000.00, '2025-11-12T18:46:18.065Z', 'active', NOW()),  -- Người "Tuấn" ra giá 3,600,000 cho sản phẩm ID 1
    (1, 1, 3000000.00, '2025-11-12T18:46:18.065Z', 'active', NOW());  -- Người "Vinh" ra giá 3,000,000 cho sản phẩm ID 1
select * from users;