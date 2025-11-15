export class Product {
    constructor(product_id, seller_id, name, description, starting_price, step_price, current_price, image_cover_url, is_active, created_at, end_time) {
        this.product_id = product_id;
        this.seller_id = seller_id;
        this.name = name;
        this.description = description;
        this.starting_price = starting_price;
        this.step_price = step_price;
        this.current_price = current_price;
        this.image_cover_url = image_cover_url;
        this.is_active = is_active;
        this.created_at = created_at;
        this.end_time = end_time;
    }
}

export class ProductProfile {
    constructor(product_id, name, image_cover_url, current_price, buy_now_price = null, is_active, created_at, end_time) {
        this.product_id = product_id;
        this.name = name;
        this.image_cover_url = image_cover_url;
        this.current_price = current_price;
        this.buy_now_price = buy_now_price;
        this.is_active = is_active;
        this.created_at = created_at;
        this.end_time = end_time;
    }  
}