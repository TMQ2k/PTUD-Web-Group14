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
    full_name VARCHAR(100),
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