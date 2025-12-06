CREATE OR REPLACE FUNCTION fnc_product_extra_images(
    _product_id INTEGER,
    _image_urls TEXT[]
)
RETURNS VOID AS $$
DECLARE
    v_url TEXT;
BEGIN
    -- Duyệt từng URL trong mảng
    FOREACH v_url IN ARRAY _image_urls
    LOOP
        INSERT INTO product_images(product_id, image_url)
        VALUES (_product_id, v_url);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_register_user(
    p_username VARCHAR,
    p_password_hashed TEXT,
    p_email VARCHAR,
    p_role VARCHAR DEFAULT 'guest'
)
RETURNS TEXT AS $$
DECLARE
    v_count INT;
    new_user_id INT;
BEGIN
    -- Kiểm tra username đã tồn tại chưa
    SELECT COUNT(*) INTO v_count
    FROM users
    WHERE username = p_username;
    
    IF v_count > 0 THEN
        RETURN 'Username already exists';
    END IF;

    -- Kiểm tra role hợp lệ
    IF NOT (p_role IN ('guest', 'bidder', 'seller', 'admin')) THEN
        RETURN 'Invalid role';
    END IF;

    -- Thêm user mới và lấy ID vừa tạo
    INSERT INTO users(username, password_hashed, email, role)
    VALUES (p_username, p_password_hashed, p_email, p_role)
    RETURNING user_id INTO new_user_id;

    -- Tạo bản ghi trong bảng users_info tương ứng
    INSERT INTO users_info(user_id) VALUES (new_user_id);
	INSERT INTO users_rating(user_id, rating_plus, rating_minus) VALUES (new_user_id, 0, 0);

    -- Trả về thông báo hoặc ID
    RETURN 'User registered successfully with ID: ' || new_user_id;
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
      AND status = TRUE
      AND verified = TRUE;  -- chỉ cho phép user active
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

$$ LANGUAGE plpgsql;
drop function fnc_create_product
CREATE OR REPLACE FUNCTION fnc_create_product
(
    p_seller_id INTEGER,
    p_name VARCHAR,
    p_description TEXT,
    p_starting_price NUMERIC(15,2),
    p_step_price NUMERIC(15,2),
	p_buy_now_price NUMERIC(15, 2),
    p_image_cover_url TEXT,
    p_end_time TIMESTAMPTZ
)
RETURNS INTEGER AS $$
DECLARE
    new_product_id INTEGER;
BEGIN
    INSERT INTO products(
        seller_id, name, description, starting_price, 
        step_price, current_price, buy_now_price, image_cover_url, end_time
    )
    VALUES (
        p_seller_id, p_name, p_description, p_starting_price, 
        p_step_price, p_starting_price, p_buy_now_price, p_image_cover_url, p_end_time
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
    created_at TIMESTAMPTZ,
    end_time TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT product_id, name, current_price, is_active, created_at, end_time
    FROM products
    WHERE seller_id = p_seller_id
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_change_password(
    p_username VARCHAR,
    p_old_password_hashed TEXT,
    p_new_password_hashed TEXT,
    p_confirm_password_hashed TEXT
)
RETURNS TEXT AS $$
DECLARE
    v_user_id INTEGER;
BEGIN
    -- 1️⃣ Kiểm tra user có tồn tại và mật khẩu cũ đúng không
    SELECT user_id INTO v_user_id
    FROM users
    WHERE username = p_username
      AND password_hashed = p_old_password_hashed
      AND status = TRUE;

    IF v_user_id IS NULL THEN
        RETURN 'Invalid username or old password';
    END IF;

    -- 2️⃣ Kiểm tra mật khẩu mới và xác nhận mật khẩu có trùng nhau không
    IF p_new_password_hashed <> p_confirm_password_hashed THEN
        RETURN 'New password and confirmation do not match';
    END IF;

    -- 3️⃣ Kiểm tra xem mật khẩu mới có khác mật khẩu cũ không
    IF p_new_password_hashed = p_old_password_hashed THEN
        RETURN 'New password cannot be the same as old password';
    END IF;

    -- 4️⃣ Cập nhật mật khẩu mới
    UPDATE users
    SET password_hashed = p_new_password_hashed,
        is_created = CURRENT_TIMESTAMP
    WHERE user_id = v_user_id;

    RETURN 'Password changed successfully';
END;
$$ LANGUAGE plpgsql;
drop function fnc_user_profile
CREATE OR REPLACE FUNCTION fnc_user_profile(
    p_user_id INT
)
RETURNS TABLE(
    user_id INT,
    username VARCHAR,
    email VARCHAR,
    role VARCHAR,
    status BOOLEAN,
    is_created TIMESTAMPTZ,
    verified BOOLEAN,
	phone_number VARCHAR(15),
	birthdate DATE,
	gender varchar(10),
	address TEXT,
	avatar_url TEXT,
	updated_at TIMESTAMPTZ,
	first_name varchar(50),
	last_name varchar(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.user_id,
        u.username,
        u.email,
        u.role,
        u.status,
        u.is_created,
        u.verified, 
		ui.phone_number,
		ui.birthdate,
		ui.gender,
		ui.address,
		ui.avatar_url,
		ui.updated_at,
		ui.first_name,
		ui.last_name
    FROM users u
		JOIN users_info ui ON ui.user_id = u.user_id
    WHERE u.user_id = p_user_id
		
      AND u.status = TRUE
	  AND u.verified = TRUE; -- chỉ trả user active
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fnc_user_watchlist_add(
    _user_id BIGINT,
    _product_id BIGINT
)
RETURNS TEXT AS $$
DECLARE
    exists_count INT;
BEGIN
    -- Kiểm tra xem product có tồn tại và đang active không (nếu cần)
    IF NOT EXISTS (SELECT 1 FROM products WHERE product_id = _product_id) THEN
        RETURN 'product_not_found';
    END IF;

    -- Kiểm tra user có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _user_id) THEN
        RETURN 'user_not_found';
    END IF;

    -- Check trùng
    SELECT COUNT(*) INTO exists_count
    FROM watchlist
    WHERE user_id = _user_id AND product_id = _product_id;

    IF exists_count > 0 THEN
        RETURN 'already_exists';
    END IF;

    -- Insert vào watchlist
    INSERT INTO watchlist(user_id, product_id)
    VALUES (_user_id, _product_id);

    RETURN 'added';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_user_watchlist_remove(
    _user_id BIGINT,
    _product_id BIGINT
)
RETURNS TEXT AS $$
DECLARE
    exists_count INT;
BEGIN
    -- Kiểm tra xem product có tồn tại và đang active không (nếu cần)
    IF NOT EXISTS (SELECT 1 FROM watchlist WHERE product_id = _product_id and _user_id = user_id) THEN
        RETURN 'product_not_found';
    END IF;

    -- Kiểm tra user có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM watchlist WHERE user_id = _user_id) THEN
        RETURN 'user_not_found';
    END IF;


    -- Insert vào watchlist
    delete from watchlist
	where user_id = _user_id and product_id = _product_id;

    RETURN 'deleted';
END;
$$ LANGUAGE plpgsql;
go
drop function fnc_user_watchlist
CREATE OR REPLACE FUNCTION fnc_user_watchlist(
    _user_id BIGINT
)
RETURNS TABLE (
    watch_id BIGINT,
    product_id INTEGER,
    product_name VARCHAR(255),
    product_description TEXT,
    image_cover_url TEXT,
    current_price NUMERIC(15,2),
    buy_now_price NUMERIC(15,2),
    is_active BOOLEAN,
    product_end_time TIMESTAMPTZ,
    watch_created_at TIMESTAMPTZ,
	product_created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id AS watch_id,
        p.product_id,
        p.name,
        p.description,
        p.image_cover_url,
        p.current_price,
        p.buy_now_price,
        p.is_active,
        p.end_time,
        w.created_at,
		p.created_at
    FROM watchlist w
    	JOIN products p ON p.product_id = w.product_id
    WHERE w.user_id = _user_id
    ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_upsert_auto_bid(
    _user_id BIGINT,
    _product_id BIGINT,
    _new_max_bid NUMERIC(12,2)
)
RETURNS TEXT AS $$
DECLARE
    old_max_bid NUMERIC(12,2);
    auction_end TIMESTAMPTZ;
    user_rating NUMERIC(5,2);
    current_price NUMERIC(12,2);
    remaining INTERVAL;
BEGIN
    -- Kiểm tra sản phẩm còn trong thời gian đấu giá
    SELECT p.end_time, p.current_price INTO auction_end, current_price
    FROM products p
    WHERE p.product_id = _product_id;

    IF auction_end IS NULL THEN
        RETURN 'Sản phẩm không tồn tại.';
    ELSIF auction_end <= NOW() THEN
        RETURN 'Sản phẩm đã hết thời gian đấu giá.';
    END IF;

    -- Kiểm tra điểm đánh giá
    SELECT ur.rating_percent INTO user_rating
    FROM users_rating ur
    WHERE ur.user_id = _user_id;

    IF user_rating IS NOT NULL AND user_rating < 80 THEN
        RETURN format('Bạn không đủ điểm đánh giá (%s%%) để đấu giá.', user_rating);
    END IF;

    -- Lấy giá max_bid hiện tại (nếu có)
    SELECT ab.max_bid_amount INTO old_max_bid
    FROM auto_bids ab
    WHERE ab.user_id = _user_id AND product_id = _product_id;

    -- 📌 Kiểm tra điều kiện gia hạn 20 phút
    remaining := auction_end - NOW();

    IF _new_max_bid > current_price AND remaining <= INTERVAL '10 minutes' THEN
        UPDATE products
        SET end_time = end_time + INTERVAL '20 minutes'
        WHERE product_id = _product_id;

        RAISE NOTICE 'Đấu giá sắp kết thúc, thời gian đã được gia hạn thêm 20 phút.';
    END IF;

    -- Xử lý insert/update auto bid
    IF NOT FOUND THEN
        INSERT INTO auto_bids(user_id, product_id, max_bid_amount, current_bid_amount)
        VALUES (_user_id, _product_id, _new_max_bid, 0);

        RETURN 'Đặt auto bid thành công.';
    ELSE
        IF _new_max_bid <= old_max_bid THEN
            RETURN format('Giá mới phải lớn hơn giá hiện tại (%s).', old_max_bid);
        END IF;

        UPDATE auto_bids
        SET max_bid_amount = _new_max_bid,
            updated_at = NOW()
        WHERE user_id = _user_id AND product_id = _product_id;

        RETURN 'Cập nhật auto bid thành công.';
    END IF;
END;
$$ LANGUAGE plpgsql;


drop function fnc_update_auto_bids;
go
CREATE OR REPLACE FUNCTION fnc_update_auto_bids(_product_id BIGINT)
RETURNS TABLE (
    current_price NUMERIC(12,2),
    highest_bidder_id BIGINT,
    username VARCHAR,
    email VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR
) AS $$
DECLARE
    v_highest_bid RECORD;
    v_second_bid NUMERIC(12,2);
    v_step_price NUMERIC(12,2);
    v_auction_end TIMESTAMP;
    v_start_price NUMERIC(12,2);
    v_new_price NUMERIC(12,2);
    v_bid_count INT;
    v_old_price NUMERIC(12,2);
BEGIN
    -- Lấy thông tin sản phẩm
    SELECT p.end_time, p.step_price, p.starting_price, p.current_price
    INTO v_auction_end, v_step_price, v_start_price, v_old_price
    FROM products p
    WHERE p.product_id = _product_id;

    IF v_auction_end IS NULL THEN
        RETURN QUERY SELECT 0::NUMERIC, NULL::BIGINT, NULL, NULL, NULL, NULL;
        RETURN;
    END IF;

    IF v_auction_end <= NOW() THEN
        RETURN QUERY
        SELECT v_old_price, NULL::BIGINT, NULL, NULL, NULL, NULL;
        RETURN;
    END IF;

    -- Lấy auto-bid cao nhất
    SELECT ab.user_id, ab.max_bid_amount
    INTO v_highest_bid
    FROM auto_bids ab
    WHERE ab.product_id = _product_id
    ORDER BY ab.max_bid_amount DESC, ab.created_at ASC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN QUERY SELECT 0::NUMERIC, NULL::BIGINT, NULL, NULL, NULL, NULL;
        RETURN;
    END IF;

    -- Đếm số bidder
    SELECT COUNT(*) INTO v_bid_count
    FROM auto_bids
    WHERE product_id = _product_id;

    -- Lấy auto-bid cao thứ nhì
    SELECT sub.amount 
    INTO v_second_bid
    FROM (
        SELECT ab.max_bid_amount AS amount
        FROM auto_bids ab
        WHERE ab.product_id = _product_id 
          AND ab.user_id <> v_highest_bid.user_id
        ORDER BY ab.max_bid_amount DESC
        LIMIT 1
    ) AS sub;

    IF v_second_bid IS NULL THEN
        v_second_bid := v_start_price;
    END IF;

    -- Tính giá mới
    IF v_bid_count = 1 THEN
        v_new_price := v_old_price; -- không thay đổi giá
    ELSE
        v_new_price := LEAST(v_highest_bid.max_bid_amount, v_second_bid + v_step_price);
    END IF;

    -- Cập nhật giá mới
    UPDATE products p
    SET current_price = v_new_price
    WHERE p.product_id = _product_id;

    -- Lưu vào product_history nếu giá có thay đổi
    IF v_new_price <> v_old_price THEN
        INSERT INTO product_history(product_id, user_id, bid_amount, bid_time)
        VALUES (_product_id, v_highest_bid.user_id, v_new_price, NOW());
    END IF;

    -- Trả về thông tin người đang dẫn đầu
    RETURN QUERY
    SELECT 
        v_new_price,
        v_highest_bid.user_id,
        u.username,
        u.email,
        ui.first_name,
        ui.last_name
    FROM users u
    LEFT JOIN users_info ui ON u.user_id = ui.user_id
    WHERE u.user_id = v_highest_bid.user_id;

END;
$$ LANGUAGE plpgsql;
drop function fnc_history_bids_product
CREATE OR REPLACE FUNCTION fnc_history_bids_product(_product_id BIGINT)
RETURNS TABLE (
    bid_time TIMESTAMPTZ,
    masked_username VARCHAR,
    bid_amount NUMERIC(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ph.bid_time,
        CASE 
            WHEN u.username IS NULL THEN NULL
            WHEN length(u.username) <= 1 THEN u.username::VARCHAR
            ELSE (substring(u.username FROM 1 FOR 1) || repeat('*', length(u.username)-1))::VARCHAR
        END AS masked_username,
        ph.bid_amount
    FROM product_history ph
    LEFT JOIN users u ON ph.user_id = u.user_id
    WHERE ph.product_id = _product_id
    ORDER BY ph.bid_time DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_delete_category(
    p_category_id integer
)
RETURNS TEXT
AS $$
BEGIN
    -- Parent ID check: nếu truyền parent_id nhưng không tồn tại -> báo lỗi
    IF p_parent_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM categories c WHERE c.category_id = p_parent_id
        ) THEN
            RAISE EXCEPTION 'Parent category with id % does not exist', p_parent_id;
        END IF;
    END IF;

    -- Insert category
    INSERT INTO categories(name, parent_id)
    VALUES (p_name, p_parent_id)
    RETURNING categories.category_id,
              categories.name,
              categories.parent_id
    INTO category_id, name, parent_id;

    RETURN NEXT;
END; 
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_create_category(
    p_name VARCHAR,
    p_parent_id INT DEFAULT NULL
)
RETURNS TABLE (
    category_id INT,
    name VARCHAR,
    parent_id INT
)
AS $$
BEGIN
    -- Parent ID check: nếu truyền parent_id nhưng không tồn tại -> báo lỗi
    IF p_parent_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM categories c WHERE c.category_id = p_parent_id
        ) THEN
            RAISE EXCEPTION 'Parent category with id % does not exist', p_parent_id;
        END IF;
    END IF;

    -- Insert category
    INSERT INTO categories(name, parent_id)
    VALUES (p_name, p_parent_id)
    RETURNING categories.category_id,
              categories.name,
              categories.parent_id
    INTO category_id, name, parent_id;

    RETURN NEXT;
END; 
$$ LANGUAGE plpgsql;

drop function fnc_delete_category
CREATE OR REPLACE FUNCTION fnc_delete_category(p_category_id integer)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_parent_id integer;
    v_child_count integer;
    v_product_count integer;
BEGIN
    -- Kiểm tra tồn tại category
    SELECT parent_id INTO v_parent_id
    FROM categories
    WHERE category_id = p_category_id;

    IF NOT FOUND THEN
        RETURN 'Category không tồn tại';
    END IF;

    ----------------------------------------------------------------------------
    -- 1. Nếu category là root (parent_id IS NULL) => kiểm tra category con
    ----------------------------------------------------------------------------
    IF v_parent_id IS NULL THEN
        SELECT COUNT(*) INTO v_child_count
        FROM categories
        WHERE parent_id = p_category_id;

        IF v_child_count > 0 THEN
            RETURN 'Không thể xoá category gốc vì vẫn còn category con.';
        END IF;
    END IF;

    ----------------------------------------------------------------------------
    -- 2. Kiểm tra category có sản phẩm không
    ----------------------------------------------------------------------------
    SELECT COUNT(*) INTO v_product_count
    FROM product_categories
    WHERE category_id = p_category_id;

    IF v_product_count > 0 THEN
        RETURN 'Không thể xoá category vì vẫn còn sản phẩm thuộc category.';
    END IF;

    ----------------------------------------------------------------------------
    -- Thực hiện xoá (xóa luôn quan hệ nếu có)
    ----------------------------------------------------------------------------
    DELETE FROM categories WHERE category_id = p_category_id;

    RETURN 'Xóa category thành công.';
END;
$$;

CREATE OR REPLACE FUNCTION fnc_update_category(
    p_category_id INTEGER,
    p_name VARCHAR
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_exists INT;
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra category tồn tại
    --------------------------------------------------------------------
    SELECT COUNT(*) INTO v_exists
    FROM categories
    WHERE category_id = p_category_id;

    IF v_exists = 0 THEN
        RETURN 'Category không tồn tại.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Cập nhật tên category
    --------------------------------------------------------------------
    UPDATE categories
    SET name = p_name
    WHERE category_id = p_category_id;

    RETURN 'Cập nhật tên category thành công.';
END;
$$;

CREATE OR REPLACE FUNCTION fnc_delete_product(
    p_product_id INTEGER
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_exists INT;
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra sản phẩm tồn tại
    --------------------------------------------------------------------
    SELECT COUNT(*) INTO v_exists
    FROM products
    WHERE product_id = p_product_id;

    IF v_exists = 0 THEN
        RETURN 'Sản phẩm không tồn tại.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Xóa các bảng liên quan
    --------------------------------------------------------------------

    -- product_categories
    DELETE FROM product_categories WHERE product_id = p_product_id;

    -- product_images
    DELETE FROM product_images WHERE product_id = p_product_id;

    -- product_descriptions
    DELETE FROM product_descriptions WHERE product_id = p_product_id;

    -- product_stats
    DELETE FROM product_stats WHERE product_id = p_product_id;

    -- product_questions và product_answers (có FK ON DELETE CASCADE nhưng xóa explicit cũng được)
    DELETE FROM product_answers WHERE question_id IN 
        (SELECT id FROM product_questions WHERE product_id = p_product_id);
    DELETE FROM product_questions WHERE product_id = p_product_id;

    -- comments
    DELETE FROM comments WHERE product_id = p_product_id;

    -- bids
    DELETE FROM bids WHERE product_id = p_product_id;

    -- auto_bids
    DELETE FROM auto_bids WHERE product_id = p_product_id;

    -- bid_rejections
    DELETE FROM bid_rejections WHERE product_id = p_product_id;

    -- watchlist
    DELETE FROM watchlist WHERE product_id = p_product_id;

    -- product_history
    DELETE FROM product_history WHERE product_id = p_product_id;

    --------------------------------------------------------------------
    -- 3. Xóa sản phẩm
    --------------------------------------------------------------------
    DELETE FROM products WHERE product_id = p_product_id;

    RETURN 'Xóa sản phẩm thành công.';
END;
$$;

select * from fnc_delete_product(7)
select * from products

CREATE OR REPLACE FUNCTION fnc_add_upgrade_request(
    p_user_id BIGINT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_role VARCHAR(20);
    v_pending_count INT;
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra user tồn tại
    --------------------------------------------------------------------
    SELECT role INTO v_role
    FROM users
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN 'User không tồn tại.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Kiểm tra role là bidder
    --------------------------------------------------------------------
    IF v_role <> 'bidder' THEN
        RETURN 'Chỉ bidder mới có thể yêu cầu nâng cấp.';
    END IF;

    --------------------------------------------------------------------
    -- 3. Kiểm tra user có request pending chưa
    --------------------------------------------------------------------
    SELECT COUNT(*) INTO v_pending_count
    FROM user_upgrade_requests
    WHERE user_id = p_user_id
      AND status = 'pending';

    IF v_pending_count > 0 THEN
        RETURN 'User đã có request đang pending.';
    END IF;

    --------------------------------------------------------------------
    -- 4. Thêm request mới
    --------------------------------------------------------------------
    INSERT INTO user_upgrade_requests (user_id)
    VALUES (p_user_id);

    RETURN 'Tạo request nâng cấp thành công.';
END;
$$;
drop function fnc_get_upgrade_requests()
CREATE OR REPLACE FUNCTION fnc_get_upgrade_requests()
RETURNS TABLE (
    request_id BIGINT,
    user_id BIGINT,
    username VARCHAR,
    email VARCHAR,
    role VARCHAR,
    status VARCHAR(20),
    rating_plus INTEGER,
    rating_minus INTEGER,
    rating_percent NUMERIC(5,2),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.user_id,
        u.username,
        u.email,
        u.role,
        r.status,
        COALESCE(ur.rating_plus,0),
        COALESCE(ur.rating_minus,0),
        COALESCE(ur.rating_percent,0),
        r.created_at,
        r.updated_at
    FROM user_upgrade_requests r
    JOIN users u ON u.user_id = r.user_id
    LEFT JOIN users_rating ur ON ur.user_id = u.user_id
    ORDER BY r.created_at DESC;
END;
$$;


CREATE OR REPLACE FUNCTION fnc_change_role_for_bidder(
    p_user_id BIGINT,
    p_action VARCHAR  -- 'approved' hoặc 'rejected'
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_role VARCHAR(20);
    v_request_id BIGINT;
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra user tồn tại
    --------------------------------------------------------------------
    SELECT role INTO v_role
    FROM users
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN 'User không tồn tại.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Kiểm tra user là bidder
    --------------------------------------------------------------------
    IF v_role <> 'bidder' THEN
        RETURN 'Chỉ bidder mới có thể thay đổi role.';
    END IF;

    --------------------------------------------------------------------
    -- 3. Kiểm tra user có request pending không
    --------------------------------------------------------------------
    SELECT id INTO v_request_id
    FROM user_upgrade_requests
    WHERE user_id = p_user_id
      AND status = 'pending'
    ORDER BY created_at ASC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN 'User không có request pending.';
    END IF;

    --------------------------------------------------------------------
    -- 4. Cập nhật request
    --------------------------------------------------------------------
    IF p_action NOT IN ('approved','rejected') THEN
        RETURN 'Tham số action phải là "approved" hoặc "rejected".';
    END IF;

    UPDATE user_upgrade_requests
    SET
        status = p_action,
        updated_at = NOW()
    WHERE id = v_request_id;

    --------------------------------------------------------------------
    -- 5. Nếu approved, đổi role user
    --------------------------------------------------------------------
    IF p_action = 'approved' THEN
        UPDATE users
        SET role = 'seller'
        WHERE user_id = p_user_id;
    END IF;

    RETURN format('Request %s thành công, role user %s.', p_action, CASE WHEN p_action='approved' THEN 'đã đổi thành seller' ELSE 'giữ nguyên bidder' END);

END;
$$;

DROP FUNCTION fnc_delete_user(integer)
CREATE OR REPLACE FUNCTION fnc_delete_user(p_user_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    _exists BOOLEAN;
BEGIN
    -- Kiểm tra user có tồn tại không
    SELECT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id)
    INTO _exists;

    IF NOT _exists THEN
        RETURN FALSE; -- User không tồn tại
    END IF;

    -- Xoá user → các bảng con sẽ tự xoá nhờ ON DELETE CASCADE
    DELETE FROM users WHERE user_id = p_user_id;

    RETURN TRUE;
END;
$$;
