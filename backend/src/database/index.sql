-- Tạo các chỉ mục cho bảng `users`
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_user_id_status ON users(user_id, status);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_rating_user_id ON users_rating(user_id);


-- Tạo các chỉ mục cho bảng `products`
CREATE INDEX idx_products_product_id ON products(product_id);
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_is_active_end_time ON products(is_active, end_time);
CREATE INDEX idx_products_end_time ON products(end_time);
CREATE INDEX idx_products_seller_id_created_at ON products(seller_id, created_at DESC);

-- Tạo chỉ mục cho bảng `users_info`
CREATE INDEX idx_users_info_user_id ON users_info(user_id);

-- Tạo chỉ mục cho bảng user_upgrade_requests
CREATE INDEX idx_upgrade_user_id ON user_upgrade_requests(user_id);
CREATE INDEX idx_upgrade_status ON user_upgrade_requests(status);
CREATE INDEX idx_upgrade_created_at ON user_upgrade_requests(created_at);
CREATE INDEX idx_upgrade_reviewed_by ON user_upgrade_requests(reviewed_by);

-- categories
CREATE UNIQUE INDEX idx_categories_name ON categories(name);

-- product_categories
CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX idx_product_categories_category_id ON product_categories(category_id);

-- product_images
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- user_otp
CREATE INDEX idx_user_otp_user_id ON user_otp(user_id);
CREATE INDEX idx_user_otp_expires_at ON user_otp(expires_at);
CREATE INDEX idx_user_otp_code_user ON user_otp(user_id, otp_code);

-- auto_bids
CREATE INDEX idx_auto_bids_user_id ON auto_bids(user_id);
CREATE INDEX idx_auto_bids_product_id ON auto_bids(product_id);
CREATE INDEX idx_auto_bids_is_active ON auto_bids(is_active);

-- Tăng tốc truy vấn mô tả theo product
CREATE INDEX idx_product_descriptions_product_id
    ON product_descriptions(product_id);

-- Lọc theo người tạo mô tả (seller)
CREATE INDEX idx_product_descriptions_created_by
    ON product_descriptions(created_by);

-- Nếu hay dùng ORDER BY created_at DESC
CREATE INDEX idx_product_descriptions_created_at
    ON product_descriptions(created_at);
-- Để hỗ trợ các phản hồi (response), bạn có thể tạo một index trên parent_comment_id để dễ dàng tìm các phản hồi cho mỗi comment.
CREATE INDEX idx_parent_comment_id ON comments(parent_comment_id);

CREATE INDEX idx_watchlist_user ON watchlist(user_id);
CREATE INDEX idx_watchlist_product ON watchlist(product_id);

-- bid_allowances
CREATE INDEX idx_bid_allowances_product ON bid_allowances(product_id)
CREATE INDEX idx_bid_allowances_user ON bid_allowances(bidder_id)


-- product_questions
create INDEX idx_questions_product ON product_questions(product_id)
create INDEX idx_questions_user ON product_questions(user_id)

-- product_answers
create INDEX idx_answers_question ON product_answers(question_id)
create INDEX idx_answers_seller ON product_answers(seller_id)

-- comments
create INDEX idx_comments_user ON comments(user_id)
create INDEX idx_comments_product ON comments(product_id)

-- product_history
create INDEX idx_history_product ON product_history(product_id)





