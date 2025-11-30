select * from auto_bids
select * from users_info 
delete from users where user_id = 3
select * from users
select * from product_categories
select * from products
delete from users where user_id = 5
select * from user_otp
select * from watchlist;
select * from users_rating;
update products
set current_price = starting_price
update users
set verified = true
where user_id = 10

update users_rating
set rating_plus = 1, rating_minus = 0
where user_id = 10

-- User 1: được đánh giá tốt nhiều
 
update users
set verified = true
where user_id = 9

SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'auto_bids';

update users
set role = 'seller'
where user_id = 1
