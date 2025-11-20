CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hashed TEXT NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'guest' CHECK (role IN ('guest', 'bidder', 'seller', 'admin')),
    is_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);

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

CREATE TABLE user_upgrade_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    cur_role VARCHAR(50) NOT NULL,
    requested_role VARCHAR(50) NOT NULL,

    reason TEXT,
    attachments JSONB,  -- có thể chứa danh sách URL hoặc metadata file
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),

    reviewed_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    review_comment TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,

    CONSTRAINT chk_different_role CHECK (cur_role <> requested_role)
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
    end_time TIMESTAMP NOT NULL
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE product_categories (
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);


CREATE TABLE user_otp (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE bids (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    bid_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'winning', 'outbid', 'rejected')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
drop table auto_bids
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

CREATE TABLE bid_rejections (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    product_id BIGINT NOT NULL,
    bidder_id BIGINT NOT NULL,

    reason VARCHAR(255) DEFAULT NULL,      -- lý do bị cấm ra giá
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by BIGINT DEFAULT NULL,        -- admin hoặc seller ban

    -- bidder có thể được gỡ cấm
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    lifted_at TIMESTAMP DEFAULT NULL,      -- thời điểm gỡ cấm
    lifted_by BIGINT DEFAULT NULL,         -- người gỡ cấm
    lift_reason VARCHAR(255) DEFAULT NULL, -- lý do gỡ cấm

    CONSTRAINT fk_bid_rej_product 
        FOREIGN KEY (product_id) REFERENCES products(product_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_bid_rej_bidder
        FOREIGN KEY (bidder_id) REFERENCES users(user_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_bid_rej_created_by
        FOREIGN KEY (created_by) REFERENCES users(user_id),

    CONSTRAINT fk_bid_rej_lifted_by
        FOREIGN KEY (lifted_by) REFERENCES users(user_id),

    -- Mỗi bidder chỉ bị cấm 1 lần trên 1 product (để tránh trùng record)
    CONSTRAINT uq_bid_rej UNIQUE (product_id, bidder_id)
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

CREATE TABLE product_descriptions (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    description TEXT NOT NULL,             -- phần mô tả mới
    created_by BIGINT REFERENCES users(user_id), -- seller thêm mô tả
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


