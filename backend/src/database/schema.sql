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
    phone_number VARCHAR(15),
    birthdate DATE,
    gender VARCHAR(10),
    address TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users_info
DROP COLUMN full_name,
ADD COLUMN first_name VARCHAR(50),
ADD COLUMN last_name VARCHAR(50);

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

CREATE OR REPLACE FUNCTION fnc_update_user_info(
    p_user_id INTEGER,
    p_first_name VARCHAR(50),
    p_last_name VARCHAR(50),
    p_phone_number VARCHAR(15),
    p_birthdate DATE,
    p_gender VARCHAR(10),
    p_address TEXT,
    p_avatar_url TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users_info
    SET 
        first_name = COALESCE(p_first_name, first_name),
        last_name = COALESCE(p_last_name, last_name),
        phone_number = COALESCE(p_phone_number, phone_number),
        birthdate = COALESCE(p_birthdate, birthdate),
        gender = COALESCE(p_gender, gender),
        address = COALESCE(p_address, address),
        avatar_url = COALESCE(p_avatar_url, avatar_url),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;

    IF FOUND THEN
        RETURN TRUE;  -- cập nhật thành công
    ELSE
        RETURN FALSE; -- không tìm thấy user_id
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_verify_user(p_user_id INT)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET verified = TRUE
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;


