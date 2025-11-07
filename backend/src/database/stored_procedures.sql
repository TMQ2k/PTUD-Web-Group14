

CREATE OR REPLACE FUNCTION fnc_register_user(
    p_username VARCHAR,
    p_password_hashed TEXT,
    p_email VARCHAR,
    p_role VARCHAR DEFAULT 'guest'
)
RETURNS TEXT AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM users
    WHERE username = p_username;
    
    IF v_count > 0 THEN
        RETURN 'Username already exists';
    END IF;

    IF NOT (p_role IN ('guest', 'bidder', 'seller', 'admin')) THEN
        RETURN 'Invalid role';
    END IF;

    INSERT INTO users(username, password_hashed, email, role)
    VALUES (p_username, p_password_hashed, p_email, p_role);

 	INSERT INTO users_info(user_id) VALUES (new_user_id);
    RETURN new_user_id;

    RETURN 'User registered successfully';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_login_user(
    p_username VARCHAR,
    p_password_hashed TEXT
)
RETURNS TABLE(
    user_id INT,
    username VARCHAR,
    email VARCHAR,
    role VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT user_id, username, email, role
    FROM users
    WHERE username = p_username
      AND password_hashed = p_password_hashed
      AND status = TRUE;  -- chỉ cho phép user active
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fnc_increase_product_price(p_product_id INT)
RETURNS NUMERIC AS $$
DECLARE
    new_price NUMERIC;
BEGIN
    UPDATE products
    SET current_price = current_price + step_price
    WHERE product_id = p_product_id
      AND is_active = TRUE
    RETURNING current_price INTO new_price;

    RETURN new_price;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_deactivate_expired_products()
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET is_active = FALSE
    WHERE end_time <= NOW()
      AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

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

CREATE OR REPLACE FUNCTION fnc_update_user_status(
    p_user_id INT,
    p_status BOOLEAN
)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET status = p_status
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fnc_update_user_role(
    p_user_id INT,
    p_role VARCHAR
)
RETURNS VOID AS $$
BEGIN
    IF p_role NOT IN ('guest', 'bidder', 'seller', 'admin') THEN
        RAISE EXCEPTION 'Invalid role';
    END IF;

    UPDATE users
    SET role = p_role
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_delete_user(p_user_id INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM users WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_create_product
(
    p_seller_id INTEGER,
    p_name VARCHAR,
    p_description TEXT,
    p_starting_price NUMERIC(15,2),
    p_step_price NUMERIC(15,2),
    p_image_cover_url TEXT,
    p_end_time TIMESTAMP
)
RETURNS INTEGER AS $$
DECLARE
    new_product_id INTEGER;
BEGIN
    INSERT INTO products(
        seller_id, name, description, starting_price, 
        step_price, current_price, image_cover_url, end_time
    )
    VALUES (
        p_seller_id, p_name, p_description, p_starting_price, 
        p_step_price, p_starting_price, p_image_cover_url, p_end_time
    )
    RETURNING product_id INTO new_product_id;

    RETURN new_product_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_get_products_by_seller(p_seller_id INT)
RETURNS TABLE (
    product_id INT,
    name VARCHAR,
    current_price NUMERIC,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    end_time TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT product_id, name, current_price, is_active, created_at, end_time
    FROM products
    WHERE seller_id = p_seller_id
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;
