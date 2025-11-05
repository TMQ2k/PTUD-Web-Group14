CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hashed TEXT NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'user',
    is_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_info (
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

CREATE TABLE user_rating (
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
