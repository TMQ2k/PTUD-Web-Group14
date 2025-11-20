select * from auto_bids
select * from users_info where user_id = 2
select * from users
select * from product_categories

SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'auto_bids';
