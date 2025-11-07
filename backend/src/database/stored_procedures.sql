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


CREATE OR REPLACE FUNCTION increase_product_price(p_product_id INT)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET current_price = current_price + step_price
    WHERE product_id = p_product_id
      AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;