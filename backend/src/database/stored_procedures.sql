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
	p_address VARCHAR,
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
	IF p_address IS NOT NULL THEN
	    INSERT INTO users_info(user_id, address) 
	    VALUES (new_user_id, p_address);
	ELSE
	    INSERT INTO users_info(user_id) 
	    VALUES (new_user_id);
	END IF;
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
    SELECT u.user_id, u.username, u.email, u.role
    FROM users u
    WHERE u.username = p_username
      AND u.password_hashed = p_password_hashed
      AND u.status = TRUE
      AND u.verified = TRUE;  -- chỉ cho phép user active
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_deactivate_expired_products()
RETURNS TABLE (
    product_id   INTEGER,
    product_name VARCHAR,
    end_time     TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    ------------------------------------------------------------
    -- 1. Lưu danh sách sản phẩm hết hạn
    ------------------------------------------------------------
    CREATE TEMP TABLE tmp_expired_products ON COMMIT DROP AS
    SELECT
        p.product_id,
        p.name AS product_name,
        p.end_time
    FROM products p
    WHERE p.end_time <= NOW()
      AND p.is_active = TRUE;

    ------------------------------------------------------------
    -- 2. Lưu người chiến thắng (chỉ khi có bid)
    ------------------------------------------------------------
    INSERT INTO user_won_products (user_id, product_id, winning_bid, won_at)
    SELECT
        ph.user_id,
        tep.product_id,
        ph.bid_amount,
        NOW()
    FROM tmp_expired_products tep
    LEFT JOIN LATERAL (
        SELECT
            ph2.user_id,
            ph2.bid_amount
        FROM product_history ph2
        WHERE ph2.product_id = tep.product_id
        ORDER BY ph2.bid_amount DESC, ph2.bid_time ASC
        LIMIT 1
    ) ph ON TRUE
    WHERE ph.user_id IS NOT NULL
      AND NOT EXISTS (
          SELECT 1
          FROM user_won_products uwp
          WHERE uwp.product_id = tep.product_id
      );

    ------------------------------------------------------------
    -- 3. Deactivate sản phẩm
    ------------------------------------------------------------
    UPDATE products p
    SET is_active = FALSE
    WHERE p.product_id IN (
        SELECT tep.product_id
        FROM tmp_expired_products tep
    );

    ------------------------------------------------------------
    -- 4. Trả về danh sách sản phẩm đã hết hạn
    ------------------------------------------------------------
    RETURN QUERY
    SELECT
        tep.product_id,
        tep.product_name,
        tep.end_time
    FROM tmp_expired_products tep;

END;
$$;


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

CREATE OR REPLACE FUNCTION fnc_product_categories(
    p_product_id   INT,        -- ID sản phẩm
    p_category_ids INT[]       -- Mảng category cần gán
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_category_id INT;               -- category đang duyệt
    v_inserted_count INT := 0;       -- số category đã thêm
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra tham số đầu vào
    --------------------------------------------------------------------
    IF p_product_id IS NULL THEN
        RAISE EXCEPTION 'Product ID (p_product_id) cannot be NULL';
    END IF;

    IF p_category_ids IS NULL OR array_length(p_category_ids, 1) IS NULL THEN
        RAISE EXCEPTION 'Category list (p_category_ids) cannot be NULL or empty';
    END IF;

    --------------------------------------------------------------------
    -- 2. Kiểm tra sản phẩm có tồn tại
    --------------------------------------------------------------------
    IF NOT EXISTS (
        SELECT 1
        FROM products AS prod
        WHERE prod.product_id = p_product_id
    ) THEN
        RAISE EXCEPTION 'Product with ID % does not exist', p_product_id;
    END IF;

    --------------------------------------------------------------------
    -- 3. Kiểm tra toàn bộ category trong mảng có tồn tại
    --------------------------------------------------------------------
    PERFORM 1
    FROM unnest(p_category_ids) AS u(cat_id)
    WHERE NOT EXISTS (
        SELECT 1
        FROM categories AS cat
        WHERE cat.category_id = u.cat_id
    );

    IF FOUND THEN
        RAISE EXCEPTION 'Some category IDs in p_category_ids do not exist';
    END IF;

    --------------------------------------------------------------------
    -- 4. Xoá toàn bộ category cũ của sản phẩm
    --------------------------------------------------------------------
    DELETE FROM product_categories AS pc
    WHERE pc.product_id = p_product_id;

    --------------------------------------------------------------------
    -- 5. Chèn category mới
    --------------------------------------------------------------------
    FOREACH v_category_id IN ARRAY p_category_ids
    LOOP
        INSERT INTO product_categories(product_id, category_id)
        VALUES (p_product_id, v_category_id);

        v_inserted_count := v_inserted_count + 1;
    END LOOP;

    --------------------------------------------------------------------
    -- 6. Trả về số category đã thêm
    --------------------------------------------------------------------
    RETURN v_inserted_count;
END;
$$;

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
    gender VARCHAR(10),
    address TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    qr_url TEXT,
    rating_plus INTEGER,
    rating_minus INTEGER,
    rating_percent NUMERIC(5,2)
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
        ui.last_name,
        ui.qr_url,
        COALESCE(ur.rating_plus, 0) AS rating_plus,
        COALESCE(ur.rating_minus, 0) AS rating_minus,
        COALESCE(ur.rating_percent, 0) AS rating_percent
    FROM users u
    JOIN users_info ui ON ui.user_id = u.user_id
    LEFT JOIN users_rating ur ON ur.user_id = u.user_id
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

CREATE OR REPLACE FUNCTION fnc_update_auto_bids(_product_id BIGINT)
RETURNS TABLE (
    current_price NUMERIC(12,2),
    highest_bidder_id BIGINT,
    username VARCHAR,
    email VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
	avatar_url TEXT,
	rating NUMERIC(5, 2)
) AS $$
DECLARE
    v_highest_bid RECORD;
    v_second_bid NUMERIC(12,2);
    v_step_price NUMERIC(12,2);
    v_auction_end TIMESTAMPTZ;
    v_start_price NUMERIC(12,2);
    v_new_price NUMERIC(12,2);
    v_bid_count INT;
    v_old_price NUMERIC(12,2);
    v_history_exists BOOLEAN;
    v_last_bidder BIGINT;

BEGIN

	SELECT ph.user_id
	INTO v_last_bidder
	FROM product_history ph
	WHERE ph.product_id = _product_id
	ORDER BY ph.bid_time DESC
	LIMIT 1;

    SELECT p.end_time, p.step_price, p.starting_price, p.current_price
    INTO v_auction_end, v_step_price, v_start_price, v_old_price
    FROM products p
    WHERE p.product_id = _product_id;

    IF v_auction_end IS NULL THEN
        RETURN QUERY
        SELECT
            0::NUMERIC(12,2),
            NULL::BIGINT,
            NULL::VARCHAR,
            NULL::VARCHAR,
            NULL::VARCHAR,
            NULL::VARCHAR;
        RETURN;
    END IF;

    IF v_auction_end <= NOW() THEN
        RETURN QUERY
        SELECT
            v_old_price,
            NULL::BIGINT,
            NULL::VARCHAR,
            NULL::VARCHAR,
            NULL::VARCHAR,
            NULL::VARCHAR;
        RETURN;
    END IF;

    SELECT ab.user_id, ab.max_bid_amount
    INTO v_highest_bid
    FROM auto_bids ab
    WHERE ab.product_id = _product_id
    ORDER BY ab.max_bid_amount DESC, ab.created_at ASC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN QUERY
        SELECT
            0::NUMERIC(12,2),
            NULL::BIGINT,
            NULL::VARCHAR,
            NULL::VARCHAR,
            NULL::VARCHAR,
            NULL::VARCHAR;
        RETURN;
    END IF;

    SELECT COUNT(*) INTO v_bid_count
    FROM auto_bids
    WHERE product_id = _product_id;

    SELECT ab.max_bid_amount
    INTO v_second_bid
    FROM auto_bids ab
    WHERE ab.product_id = _product_id
      AND ab.user_id <> v_highest_bid.user_id
    ORDER BY ab.max_bid_amount DESC
    LIMIT 1;

    IF v_second_bid IS NULL THEN
        v_second_bid := v_start_price;
    END IF;

    IF v_bid_count = 1 THEN
        v_new_price := v_old_price;
    ELSE
        v_new_price := LEAST(v_highest_bid.max_bid_amount, v_second_bid);
    END IF;

    UPDATE products
    SET current_price = v_new_price
    WHERE product_id = _product_id;

    SELECT EXISTS (
        SELECT 1 FROM product_history WHERE product_id = _product_id
    ) INTO v_history_exists;

	IF v_new_price <> v_old_price
	   OR v_last_bidder IS DISTINCT FROM v_highest_bid.user_id
	THEN
	    INSERT INTO product_history(product_id, user_id, bid_amount)
	    VALUES (_product_id, v_highest_bid.user_id, v_new_price);
	END IF;


    RETURN QUERY
    SELECT
        v_new_price,
        v_highest_bid.user_id,
        u.username,
        u.email,
        ui.first_name,
        ui.last_name,
		ui.avatar_url,
		ur.rating_percent
    FROM users u
    LEFT JOIN users_info ui ON u.user_id = ui.user_id
	LEFT JOIN users_rating ur ON u.user_id = ur.user_id
    WHERE u.user_id = v_highest_bid.user_id;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_history_bids_product(_product_id BIGINT)
RETURNS TABLE (
	bidder_id INTEGER,
    bid_time TIMESTAMPTZ,
    masked_username VARCHAR,
    bid_amount NUMERIC(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
		u.user_id,
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

CREATE OR REPLACE FUNCTION public.fnc_delete_category(p_category_id integer)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
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
$function$;

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
	WHERE r.status = 'pending'
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

CREATE OR REPLACE FUNCTION fnc_deactivate_expired_sellers()
RETURNS VOID AS $$
BEGIN
    -- 1. Hạ role seller -> bidder
    UPDATE users u
    SET role = 'bidder'
    FROM user_upgrade_requests ur
    WHERE 
        u.user_id = ur.user_id
        AND u.role = 'seller'
        AND ur.status = 'approved'
        AND ur.updated_at <= NOW() - INTERVAL '7 days';

    -- 2. Đổi trạng thái request thành expired
    UPDATE user_upgrade_requests ur
    SET status = 'expired'
    WHERE 
        ur.status = 'approved'
        AND ur.updated_at <= NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fnc_get_seller_start_time(p_user_id BIGINT)
RETURNS TIMESTAMPTZ AS $$
DECLARE
    seller_start TIMESTAMPTZ;
    user_role VARCHAR(20);
BEGIN
    -- Lấy role hiện tại của user
    SELECT role INTO user_role
    FROM users
    WHERE user_id = p_user_id;

    -- Nếu không phải seller → trả về NULL
    IF user_role <> 'seller' THEN
        RETURN NULL;
    END IF;

    -- Lấy thời điểm được duyệt thành seller (bản ghi approved mới nhất)
    SELECT updated_at INTO seller_start
    FROM user_upgrade_requests
    WHERE user_id = p_user_id
      AND status = 'approved'
    ORDER BY updated_at DESC
    LIMIT 1;

    RETURN seller_start;
END;
$$ LANGUAGE plpgsql;


SELECT fnc_get_seller_start_time(36);


CREATE OR REPLACE FUNCTION fnc_seller_rejects_bidder_on_product(
    p_product_id BIGINT,
    p_seller_id BIGINT,
    p_bidder_id BIGINT,
    p_reason VARCHAR
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_seller_of_product BIGINT;
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra product có thuộc seller hay không
    --------------------------------------------------------------------
    SELECT p.seller_id
    INTO v_seller_of_product
    FROM products AS p
    WHERE p.product_id = p_product_id;

    IF v_seller_of_product IS NULL THEN
        RETURN 'Product does not exist.';
    END IF;

    IF v_seller_of_product <> p_seller_id THEN
        RETURN 'You are not the seller of this product.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Kiểm tra nếu bidder đã bị cấm và đang active
    --------------------------------------------------------------------
    IF EXISTS (
        SELECT 1
        FROM bid_rejections AS br
        WHERE br.product_id = p_product_id
          AND br.bidder_id = p_bidder_id
    ) THEN
        RETURN 'Bidder is already banned on this product.';
    END IF;

    --------------------------------------------------------------------
    -- 3. Kiểm tra nếu trước đây đã từng bị cấm (is_active = FALSE)
    --    Vì UNIQUE(product_id, bidder_id) → không thể thêm bản ghi mới
    --------------------------------------------------------------------
    IF EXISTS (
        SELECT 1
        FROM bid_rejections AS br
        WHERE br.product_id = p_product_id
          AND br.bidder_id = p_bidder_id
    ) THEN
        RETURN 'Bidder already has a ban record (inactive) and cannot be banned again.';
    END IF;

    --------------------------------------------------------------------
    -- 4. Thêm bản ghi cấm
    --------------------------------------------------------------------
    INSERT INTO bid_rejections (
        product_id,
        bidder_id,
        reason,
        created_by
    )
    VALUES (
        p_product_id,
        p_bidder_id,
        p_reason,
        p_seller_id
    );

	delete from bid_allow_requests 
	where p_product_id = product_id 
		AND p_bidder_id = bidder_id;

	delete from auto_bids
	where p_product_id = product_id
		AND p_bidder_id = user_id;

	delete from product_history
	where p_product_id = product_id
		AND p_bidder_id = user_id;
		
    RETURN 'Bidder banned successfully.';
END;
$$;

CREATE OR REPLACE FUNCTION fnc_upsert_auto_bid(
    _user_id BIGINT,
    _product_id BIGINT,
    _new_max_bid NUMERIC(12,2)
)
RETURNS TEXT AS $$
DECLARE
	start_price NUMERIC(12,2);
    old_max_bid NUMERIC(12,2);
    auction_end TIMESTAMPTZ;
    user_rating NUMERIC(5,2);
    current_price NUMERIC(12,2);
    remaining INTERVAL;
    is_banned BOOLEAN;
    is_allowed BOOLEAN;
    is_extendable BOOLEAN;
	is_active BOOLEAN;
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra sản phẩm còn trong thời gian đấu giá
    --------------------------------------------------------------------
    SELECT p.end_time, p.current_price, p.starting_price, p.is_active
    INTO auction_end, current_price, start_price, is_active
    FROM products p
    WHERE p.product_id = _product_id;

    IF auction_end IS NULL THEN
        RETURN 'Sản phẩm không tồn tại.';
    ELSIF auction_end <= NOW() THEN
        RETURN 'Sản phẩm đã hết thời gian đấu giá.';
    END IF;

	IF _new_max_bid < start_price THEN
	    RETURN format(
	        'Giá auto bid (%s) không được nhỏ hơn giá khởi điểm (%s).',
	        _new_max_bid,
	        start_price
	    );
	END IF;

	IF NOT is_active THEN
	    RETURN 'Sản phẩm đã bị ngừng đấu giá.';
	END IF;
	--------------------------------------------------------------------
	-- 2. Kiểm tra quyền đấu giá bằng fnc_is_bids
	--------------------------------------------------------------------
	IF NOT fnc_is_bids(_product_id, _user_id) THEN
	    RETURN 'Bạn không đủ điều kiện để tham gia đấu giá sản phẩm này.';
	END IF;


    --------------------------------------------------------------------
    -- 4. Lấy max_bid hiện tại (nếu có)
    --------------------------------------------------------------------
    SELECT ab.max_bid_amount
    INTO old_max_bid
    FROM auto_bids ab
    WHERE ab.user_id = _user_id AND ab.product_id = _product_id;

    --------------------------------------------------------------------
    -- 5. Kiểm tra gia hạn 20 phút
    --------------------------------------------------------------------
    SELECT EXISTS (
        SELECT 1 FROM auction_extensions WHERE product_id = _product_id
    ) INTO is_extendable;
    
	remaining := auction_end - NOW();

    --------------------------------------------------------------------
    -- 6. INSERT hoặc UPDATE auto-bid
    --------------------------------------------------------------------
    IF old_max_bid IS NULL THEN
        INSERT INTO auto_bids(user_id, product_id, max_bid_amount, current_bid_amount)
        VALUES (_user_id, _product_id, _new_max_bid, 0);

	    IF is_extendable
	       AND _new_max_bid > current_price
	       AND remaining <= INTERVAL '5 minutes'
	    THEN
	        UPDATE products
	        SET end_time = end_time + INTERVAL '10 minutes'
	        WHERE product_id = _product_id;
	
	        RAISE NOTICE 'Thời gian đấu giá được gia hạn thêm 10 phút.';
	    END IF;

        RETURN 'Đặt auto bid thành công.';
    ELSE
        IF _new_max_bid <= old_max_bid THEN
            RETURN format('Giá mới phải lớn hơn giá hiện tại (%s).', old_max_bid);
        END IF;

        UPDATE auto_bids
        SET max_bid_amount = _new_max_bid,
            updated_at = NOW()
        WHERE user_id = _user_id AND product_id = _product_id;

	    IF is_extendable
	       AND _new_max_bid > current_price
	       AND remaining <= INTERVAL '5 minutes'
	    THEN
	        UPDATE products
	        SET end_time = end_time + INTERVAL '10 minutes'
	        WHERE product_id = _product_id;
	
	        RAISE NOTICE 'Thời gian đấu giá được gia hạn thêm 10 phút.';
	    END IF;

        RETURN 'Cập nhật auto bid thành công.';
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_judge_user(
    p_transaction_id BIGINT,  -- giao dịch liên quan
    p_from_user_id   BIGINT,  -- người đánh giá
    p_to_user_id     BIGINT,  -- người bị đánh giá
    p_value          INT,     -- chỉ nhận 1 hoặc -1
    p_content        TEXT     -- nội dung đánh giá
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    --------------------------------------------------------------------
    -- 0. Kiểm tra giá trị đánh giá
    --------------------------------------------------------------------
    IF p_value NOT IN (1, -1) THEN
        RETURN 'Giá trị đánh giá chỉ được +1 hoặc -1.';
    END IF;

    --------------------------------------------------------------------
    -- 1. Không cho tự đánh giá
    --------------------------------------------------------------------
    IF p_from_user_id = p_to_user_id THEN
        RETURN 'Không thể tự đánh giá chính mình.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Lưu review (chống đánh giá trùng nhờ UNIQUE constraint)
    --------------------------------------------------------------------
    INSERT INTO user_reviews (
        transaction_id,
        from_user,
        to_user,
        value,
        content
    )
    VALUES (
        p_transaction_id,
        p_from_user_id,
        p_to_user_id,
        p_value,
        p_content
    );

    --------------------------------------------------------------------
    -- 3. Tạo hoặc cập nhật users_rating
    --------------------------------------------------------------------
    INSERT INTO users_rating (user_id, rating_plus, rating_minus)
    VALUES (
        p_to_user_id,
        CASE WHEN p_value = 1 THEN 1 ELSE 0 END,
        CASE WHEN p_value = -1 THEN 1 ELSE 0 END
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        rating_plus  = users_rating.rating_plus
                       + CASE WHEN p_value = 1 THEN 1 ELSE 0 END,
        rating_minus = users_rating.rating_minus
                       + CASE WHEN p_value = -1 THEN 1 ELSE 0 END;

    RETURN 'Đánh giá người dùng thành công.';
EXCEPTION
    WHEN unique_violation THEN
        RETURN 'Bạn đã đánh giá người dùng này cho giao dịch này rồi.';
END;
$$;

CREATE OR REPLACE FUNCTION fnc_delete_rejection(
    p_product_id BIGINT,
    p_seller_id BIGINT,
    p_bidder_id BIGINT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_seller_of_product BIGINT;
    v_exists BOOLEAN;
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra product có thuộc seller hay không
    --------------------------------------------------------------------
    SELECT p.seller_id
    INTO v_seller_of_product
    FROM products AS p
    WHERE p.product_id = p_product_id;

    IF v_seller_of_product IS NULL THEN
        RETURN 'Product does not exist.';
    END IF;

    IF v_seller_of_product <> p_seller_id THEN
        RETURN 'You are not the seller of this product.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Kiểm tra bản ghi cấm tồn tại
    --------------------------------------------------------------------
    SELECT EXISTS (
        SELECT 1
        FROM bid_rejections AS br
        WHERE br.product_id = p_product_id
          AND br.bidder_id = p_bidder_id
    ) INTO v_exists;

    IF NOT v_exists THEN
        RETURN 'No ban record found for this bidder on this product.';
    END IF;

    --------------------------------------------------------------------
    -- 3. Xóa bản ghi cấm
    --------------------------------------------------------------------
    DELETE FROM bid_rejections
    WHERE product_id = p_product_id
      AND bidder_id = p_bidder_id;

    RETURN 'Ban record deleted successfully.';
END;
$$;

CREATE OR REPLACE FUNCTION fnc_bidder_request_bids(
    p_product_id BIGINT,
    p_bidder_id BIGINT,
    p_reason TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra sản phẩm tồn tại
    --------------------------------------------------------------------
    SELECT EXISTS(
        SELECT 1
        FROM products
        WHERE product_id = p_product_id
    ) INTO v_exists;

    IF NOT v_exists THEN
        RETURN 'Product does not exist.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Kiểm tra bidder đã gửi request trước đó chưa
    --------------------------------------------------------------------
    SELECT EXISTS(
        SELECT 1
        FROM bid_allow_requests
        WHERE product_id = p_product_id
          AND bidder_id = p_bidder_id
    ) INTO v_exists;

    IF v_exists THEN
        RETURN 'You have already sent a request for this product.';
    END IF;

    --------------------------------------------------------------------
    -- 3. Thêm request mới
    --------------------------------------------------------------------
    INSERT INTO bid_allow_requests (
        product_id,
        bidder_id,
        reason,
        created_at
    )
    VALUES (
        p_product_id,
        p_bidder_id,
        p_reason,
        NOW()
    );

    RETURN 'Your request has been submitted successfully.';
END;
$$;

CREATE OR REPLACE FUNCTION public.fnc_get_requests_by_seller_product(p_seller_id bigint, p_product_id bigint)
 RETURNS TABLE(request_id bigint, bidder_id bigint, bidder_username character varying, bidder_rating numeric, reason text, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        r.request_id,
        r.bidder_id,
        u.username              AS bidder_username,
        ur.rating_percent       AS bidder_rating,
        r.reason,
        r.created_at
    FROM bid_allow_requests r
    JOIN products p
        ON r.product_id = p.product_id
    JOIN users u
        ON r.bidder_id = u.user_id
    LEFT JOIN users_rating ur
        ON ur.user_id = r.bidder_id
    WHERE p.seller_id = p_seller_id
      AND r.product_id = p_product_id
    ORDER BY r.created_at DESC;
END;
$function$;


CREATE OR REPLACE FUNCTION fnc_enable_auction_extension(
    _seller_id BIGINT,
    _product_id BIGINT
)
RETURNS TEXT AS $$
DECLARE
    v_seller_id BIGINT;
    exists_extension BOOLEAN;
BEGIN
    --------------------------------------------------------------------
    -- 1. Lấy seller_id của product (nếu không có → product không tồn tại)
    --------------------------------------------------------------------
    SELECT p.seller_id
    INTO v_seller_id
    FROM products p
    WHERE p.product_id = _product_id;

    IF v_seller_id IS NULL THEN
        RETURN 'Sản phẩm không tồn tại.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Kiểm tra sản phẩm có thuộc seller này hay không
    --------------------------------------------------------------------
    IF v_seller_id <> _seller_id THEN
        RETURN 'Bạn không phải chủ sở hữu sản phẩm này.';
    END IF;

    --------------------------------------------------------------------
    -- 3. Kiểm tra đã bật gia hạn chưa
    --------------------------------------------------------------------
    SELECT EXISTS (
        SELECT 1
        FROM auction_extensions ae
        WHERE ae.product_id = _product_id
    ) INTO exists_extension;

    IF exists_extension THEN
        RETURN 'Tính năng gia hạn đã được bật trước đó.';
    END IF;

    --------------------------------------------------------------------
    -- 4. Thêm vào bảng auction_extensions
    --------------------------------------------------------------------
    INSERT INTO auction_extensions(product_id)
    VALUES (_product_id);

    RETURN 'Đã bật tính năng gia hạn cho sản phẩm.';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_seller_allows_bidder_on_product (
    p_product_id BIGINT,
    p_seller_id  BIGINT,
    p_bidder_id  BIGINT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $function$
DECLARE
    v_seller_of_product BIGINT;
BEGIN
    --------------------------------------------------------------------
    -- 1. Kiểm tra product có tồn tại và có thuộc seller hay không
    --------------------------------------------------------------------
    SELECT p.seller_id
    INTO v_seller_of_product
    FROM products p
    WHERE p.product_id = p_product_id;

    IF v_seller_of_product IS NULL THEN
        RETURN 'Product does not exist.';
    END IF;

    IF v_seller_of_product <> p_seller_id THEN
        RETURN 'You are not the seller of this product.';
    END IF;

    --------------------------------------------------------------------
    -- 2. Kiểm tra bidder đã được phép trước đó chưa
    --------------------------------------------------------------------
    IF EXISTS (
        SELECT 1
        FROM bid_allowances ba
        WHERE ba.product_id = p_product_id
          AND ba.bidder_id  = p_bidder_id
    ) THEN
        RETURN 'Bidder is already allowed for this product.';
    END IF;

    --------------------------------------------------------------------
    -- 3. Thêm bản ghi cho phép bidder
    --------------------------------------------------------------------
    INSERT INTO bid_allowances (
        product_id,
        bidder_id,
        created_by
    )
    VALUES (
        p_product_id,
        p_bidder_id,
        p_seller_id
    );

	delete from bid_allow_requests 
	where p_product_id = product_id 
		AND p_bidder_id = bidder_id;
    RETURN 'Bidder is now allowed to bid on this product.';
END;
$function$;
CREATE OR REPLACE FUNCTION fnc_is_bids (
    p_product_id BIGINT,
    p_user_id    BIGINT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_has_rejection BOOLEAN;
    v_has_allowance BOOLEAN;
    v_rating NUMERIC;
BEGIN
    -- Product tồn tại & active
    IF NOT EXISTS (
        SELECT 1 FROM products
        WHERE product_id = p_product_id
          AND is_active = TRUE
    ) THEN
        RETURN FALSE;
    END IF;

    -- Ban tuyệt đối
    SELECT EXISTS (
        SELECT 1 FROM bid_rejections
        WHERE product_id = p_product_id
          AND bidder_id  = p_user_id
    ) INTO v_has_rejection;

    IF v_has_rejection THEN
        RETURN FALSE;
    END IF;

    -- Allowance
    SELECT EXISTS (
        SELECT 1 FROM bid_allowances
        WHERE product_id = p_product_id
          AND bidder_id  = p_user_id
    ) INTO v_has_allowance;

    -- Rating
    SELECT rating_percent
    INTO v_rating
    FROM users_rating
    WHERE user_id = p_user_id;

    -- Rating thấp thì chỉ cho nếu có allowance
    IF v_rating IS NULL OR v_rating < 80 THEN
        IF NOT v_has_allowance THEN
            RETURN FALSE;
        END IF;
    END IF;

    RETURN TRUE;
END;
$$;


CREATE OR REPLACE FUNCTION fnc_user_reviewed(user_id BIGINT)
RETURNS TABLE (
    review_id BIGINT,
    from_user BIGINT,
    value INT,
    content TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ur.review_id,
        ur.from_user,
        ur.value,
        ur.content,
        ur.created_at
    FROM
        user_reviews ur
    WHERE
        ur.to_user = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_user_won_product(p_user_id BIGINT)
RETURNS TABLE (
	won_id BIGINT,
    product_id BIGINT,
    product_name VARCHAR,
    winning_bid NUMERIC(15,2),
    image_cover_url text,
    seller_id INTEGER,
    seller_name TEXT,
    seller_qr_url TEXT,
    status VARCHAR(20),
	payment TEXT,
	seller_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
		uwp.id,
        uwp.product_id,
        p.name,
        uwp.winning_bid,
        p.image_cover_url,
        p.seller_id,
        CONCAT(ui.first_name, ' ', ui.last_name) AS seller_name,
        ui.qr_url AS seller_qr_url,
        uwp.status,
		uwp.payment,
		uwp.seller_url
    FROM user_won_products uwp
    JOIN products p
        ON uwp.product_id = p.product_id
    LEFT JOIN users u
        ON p.seller_id = u.user_id
    LEFT JOIN users_info ui
        ON u.user_id = ui.user_id
    WHERE uwp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_seller_deactive_product(p_seller_id BIGINT)
RETURNS TABLE (s
	won_id BIGINT, 
    product_id INTEGER,
    product_name VARCHAR,
    winning_bid NUMERIC(15,2),
    product_image TEXT,
    bidder_image_url TEXT,
    seller_id BIGINT,
    seller_name TEXT,
    bidder_id BIGINT,
    bidder_name TEXT,
    bidder_email VARCHAR,
    bidder_address TEXT,
    bidder_phone VARCHAR,
    status VARCHAR(20),
	payment TEXT,
	seller_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
		uwp.id,
        p.product_id,
        p.name AS product_name,
        uwp.winning_bid,
        p.image_cover_url AS product_image,
        bi.avatar_url AS bidder_image_url,
        p.seller_id::BIGINT AS seller_id,
        CONCAT(si.first_name, ' ', si.last_name) AS seller_name,
        uwp.user_id AS bidder_id,
        CONCAT(bi.first_name, ' ', bi.last_name) AS bidder_name,
        u.email AS bidder_email,
        bi.address AS bidder_address,
        bi.phone_number AS bidder_phone,
        uwp.status,
		uwp.payment,
		uwp.seller_url
    FROM user_won_products uwp
    JOIN products p
        ON uwp.product_id = p.product_id
    LEFT JOIN users u
        ON uwp.user_id = u.user_id
    LEFT JOIN users_info bi
        ON u.user_id = bi.user_id
    LEFT JOIN users s
        ON p.seller_id = s.user_id
    LEFT JOIN users_info si
        ON s.user_id = si.user_id
    WHERE p.is_active = FALSE
      AND p.seller_id = p_seller_id
	  AND uwp.user_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_seller_change_status_won_product(
    p_won_id BIGINT,
    p_status VARCHAR
)
RETURNS VOID AS $$
BEGIN
    -- Kiểm tra trạng thái hợp lệ
    IF p_status NOT IN ('invalid', 'sent', 'paid', 'received', 'cancelled') THEN
        RAISE EXCEPTION 'Trạng thái không hợp lệ: %', p_status;
    END IF;

    -- Cập nhật status
    UPDATE user_won_products
    SET status = p_status
    WHERE id = p_won_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_get_products_bidded(p_user_id BIGINT)
RETURNS TABLE (
    product_id INTEGER,
    product_name VARCHAR,
    seller_id INT,
    max_bid_amount NUMERIC(12,2),
    current_bid_amount NUMERIC(12,2),
    is_winner BOOLEAN,
    end_time TIMESTAMPtz
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.product_id,
        p.name,
        p.seller_id,
        ab.max_bid_amount,
        ab.current_bid_amount,
        ab.is_winner,
        p.end_time
    FROM auto_bids ab
    JOIN products p ON p.product_id = ab.product_id
    WHERE ab.user_id = p_user_id
    ORDER BY p.end_time DESC;
END;
$$;

CREATE OR REPLACE FUNCTION fnc_banned_in_product(
    p_product_id INTEGER
)
RETURNS TABLE (
    user_id INTEGER,
    username VARCHAR,
    email VARCHAR,
    role VARCHAR,
    user_status BOOLEAN,
    first_name VARCHAR,
    last_name VARCHAR,
    phone_number VARCHAR,
    reason VARCHAR,
    banned_at TIMESTAMPTZ,
    banned_by BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.user_id,
        u.username,
        u.email,
        u.role,
        u.status,
        ui.first_name,
        ui.last_name,
        ui.phone_number,
        br.reason,
        br.created_at,
        br.created_by
    FROM bid_rejections br
    JOIN users u
        ON br.bidder_id = u.user_id
    LEFT JOIN users_info ui
        ON u.user_id = ui.user_id
    WHERE br.product_id = p_product_id;
END;
$$;
