select * from users where username = 'seller'
select * from products where end_time < now()
	select * from products where seller_id = 37

select * from bid_allowances

select * from auto_bids
select * from users_info 
select * from categories
delete from users where user_id = 3
select * from users
delete from user_upgrade_requests
select * from product_categories
select * from products
select * from users_rating
select * from product_descriptions
select * from product_categories
delete from products where product_id = 5
select * from product_images
delete from users where user_id = 5
select * from user_otp
select * from watchlist;
select * from users_rating;
select * from product_history;
update products
set current_price = starting_price
delete from users where user_id in(2, 9, )

update users
set role = 'bidder'
where user_id = 14
delete from products where product_id = 6
update users_rating
set rating_plus = 1, rating_minus = 0
where user_id = 42


insert into categories
values('')
-- User 1: được đánh giá tốt nhiều
 
update users
set verified = true
where user_id = 43

select * from auto_bids

update products
set current_price = starting_price
where product_id in (10, 11)

delete from auto_bids
delete from product_history

SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'auto_bids';

update users
set role = 'seller'
where user_id = 1


