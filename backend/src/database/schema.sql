CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hashed TEXT NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'guest' CHECK (role IN ('guest', 'bidder', 'seller', 'admin')),
    is_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);
select * from users
go
CREATE TABLE users_info (
    user_info_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(15),
    birthdate DATE,
    gender VARCHAR(10),
    address TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users_info
ADD COLUMN address VARCHAR(250);
select * from users_info
select * from user_upgrade_requests
go
CREATE TABLE users_rating (
    user_rating_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    rating_plus INTEGER DEFAULT 0,
    rating_minus INTEGER DEFAULT 0,
    rating_percent NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN (rating_plus + rating_minus) > 0 
            THEN (rating_plus::NUMERIC / (rating_plus + rating_minus)) * 100
            ELSE 0
        END
    ) STORED
);
go
ALTER TABLE users_rating
ADD CONSTRAINT uq_users_rating_user_id UNIQUE (user_id);
go
drop table user_upgrade_requests
CREATE TABLE user_upgrade_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE user_upgrade_requests
ADD CONSTRAINT user_upgrade_requests_status_check
CHECK (status IN ('pending', 'approved', 'rejected', 'expired'));
select * from user_upgrade_requests
go

CREATE TABLE auction_extensions (
    product_id BIGINT PRIMARY KEY
        REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    starting_price NUMERIC(15,2) NOT NULL,
    step_price NUMERIC(15,2) DEFAULT 0,
    current_price NUMERIC(15,2) DEFAULT 0,
    image_cover_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NOT NULL,
);

ALTER TABLE products
ADD CONSTRAINT chk_is_active_end_time
CHECK (
    (is_active = TRUE AND end_time > NOW())
    OR
    (is_active = FALSE)
);


go
ALTER TABLE products
ADD COLUMN buy_now_price NUMERIC(15,2);
go
ALTER TABLE products
ADD CONSTRAINT chk_min_duration
CHECK (end_time >= created_at + INTERVAL '3 hours');
go
alter table products
drop constraint chk_min_duration 

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
	parent_id integer references categories(category_id) on delete cascade 
);
ALTER TABLE categories
ALTER COLUMN parent_id SET DEFAULT NULL;

go
CREATE TABLE product_categories (
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);
go
CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

go
CREATE TABLE user_otp (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

go
CREATE TABLE auto_bids (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,

    max_bid_amount NUMERIC(12, 2) NOT NULL CHECK (max_bid_amount > 0),
    current_bid_amount NUMERIC(12, 2) DEFAULT 0 CHECK (current_bid_amount >= 0),
    
    is_winner BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE (user_id, product_id)
);
go
select * from products
delete from products where product_id in (54, 55, 56)
select * from bid_rejections
CREATE TABLE bid_rejections (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    product_id BIGINT NOT NULL,
    bidder_id BIGINT NOT NULL,

    reason VARCHAR(255) DEFAULT NULL,      -- lý do bị cấm ra giá
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by BIGINT DEFAULT NULL,        -- admin hoặc seller ban

    CONSTRAINT fk_bid_rej_product 
        FOREIGN KEY (product_id) REFERENCES products(product_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_bid_rej_bidder
        FOREIGN KEY (bidder_id) REFERENCES users(user_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_bid_rej_created_by
        FOREIGN KEY (created_by) REFERENCES users(user_id),

    -- Mỗi bidder chỉ bị cấm 1 lần trên 1 product (để tránh trùng record)
    CONSTRAINT uq_bid_rej UNIQUE (product_id, bidder_id)
);
go
select * from bid_rejections
delete from bid_allowances
CREATE TABLE bid_allowances (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    bidder_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_by BIGINT NOT NULL REFERENCES users(user_id), -- seller
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (product_id, bidder_id)
);
go
drop table bid_allow_requests
CREATE TABLE bid_allow_requests (
    request_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    bidder_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reason TEXT DEFAULT NULL,            -- lý do bidder muốn được phép
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- mỗi bidder chỉ được request 1 lần trên 1 sản phẩm để tránh trùng
    CONSTRAINT uq_bid_allow_request UNIQUE (product_id, bidder_id)
);


CREATE TABLE product_questions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,           -- người hỏi (bidder)
    question TEXT NOT NULL,            -- nội dung câu hỏi

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL,

    is_hidden BOOLEAN NOT NULL DEFAULT FALSE, -- ẩn câu hỏi (seller/admin)
    hidden_at TIMESTAMP NULL,
    hidden_by BIGINT NULL,

    CONSTRAINT fk_pq_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_pq_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_pq_hidden_by
        FOREIGN KEY (hidden_by) REFERENCES users(user_id)
);
go
CREATE TABLE product_answers (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    question_id BIGINT NOT NULL,          -- tham chiếu câu hỏi
    seller_id BIGINT NOT NULL,            -- người trả lời (seller)
    answer TEXT NOT NULL,                 -- nội dung trả lời

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL,

    is_hidden BOOLEAN NOT NULL DEFAULT FALSE, -- ẩn trả lời
    hidden_at TIMESTAMP NULL,
    hidden_by BIGINT NULL,

    CONSTRAINT fk_pa_question
        FOREIGN KEY (question_id) REFERENCES product_questions(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_pa_seller
        FOREIGN KEY (seller_id) REFERENCES users(user_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_pa_hidden_by
        FOREIGN KEY (hidden_by) REFERENCES users(user_id)
);
go
CREATE TABLE product_descriptions (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    description TEXT NOT NULL,             -- phần mô tả mới
    created_by BIGINT REFERENCES users(user_id), -- seller thêm mô tả
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
go
CREATE TABLE product_stats (
    product_id BIGINT PRIMARY KEY REFERENCES products(product_id) ON DELETE CASCADE,
    
    total_bids INT DEFAULT 0,               -- tổng số lượt ra giá
    max_bid NUMERIC(15,2) DEFAULT 0,       -- giá cao nhất hiện tại
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

go
CREATE TABLE comments (
    comment_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE, -- Người viết comment
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE, -- Sản phẩm liên quan
    content TEXT NOT NULL, -- Nội dung comment
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Thời gian tạo comment
    parent_comment_id BIGINT REFERENCES comments(comment_id) ON DELETE CASCADE, -- ID comment gốc nếu là phản hồi (nullable)
    
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_comment_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);
go
CREATE TABLE watchlist (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Không cho lưu trùng 1 sản phẩm vào watchlist của 1 user
    CONSTRAINT uq_watchlist_user_product UNIQUE (user_id, product_id)
);

CREATE TABLE product_history (
    history_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    bid_amount NUMERIC(15,2) NOT NULL,        -- giá đã đấu
    bid_time TIMESTAMPTZ NOT NULL DEFAULT NOW()  -- thời điểm ra giá
);

CREATE TABLE user_reviews (
    review_id BIGSERIAL PRIMARY KEY,
    
    from_user BIGINT NOT NULL,   -- người đánh giá
    to_user   BIGINT NOT NULL,   -- người bị đánh giá

    value INT NOT NULL
        CHECK (value IN (1, -1)), -- +1 hoặc -1

    content TEXT DEFAULT NULL,   -- nội dung đánh giá

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    ----------------------------------------------------------------
    -- RÀNG BUỘC
    ----------------------------------------------------------------

    CONSTRAINT fk_review_from_user
        FOREIGN KEY (from_user)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_to_user
        FOREIGN KEY (to_user)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    -- Không cho tự đánh giá
    CONSTRAINT chk_review_not_self
        CHECK (from_user <> to_user)

);

CREATE TABLE user_won_products (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,   -- người chiến thắng

    product_id BIGINT NOT NULL
        REFERENCES products(product_id) ON DELETE CASCADE, -- sản phẩm thắng đấu giá

    winning_bid NUMERIC(15,2) NOT NULL,   -- giá thắng
    won_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- thời điểm thắng

    -- mỗi sản phẩm chỉ có 1 người thắng
    CONSTRAINT uq_won_product UNIQUE (product_id)
);

ALTER TABLE user_won_products
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'invalid'
CHECK (status IN ('invalid', 'sent', 'paid', 'received'));
ALTER TABLE user_won_products
DROP CONSTRAINT user_won_products_status_check;
ALTER TABLE user_won_products
ADD CONSTRAINT user_won_products_status_check
CHECK (status IN ('invalid', 'sent', 'paid', 'received', 'cancelled'));



ALTER TABLE user_won_products
ADD COLUMN seller_url TEXT DEFAULT NULL
select * from user_won_products

