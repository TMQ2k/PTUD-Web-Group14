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