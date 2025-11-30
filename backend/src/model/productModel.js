export class Product {
    constructor(product_id, seller, name, description, starting_price, buy_now_price, step_price, current_price, image_cover_url, extra_image_url = [], is_active, created_at, end_time, bidder, top_bidder, history = [], otherProducts = []) {
        this.product_id = product_id;
        this.seller = seller;
        this.name = name;
        this.description = description;
        this.starting_price = starting_price;
        this.step_price = step_price;
        this.current_price = current_price;
        this.image_cover_url = image_cover_url;
        this.extra_image_url = extra_image_url;
        this.is_active = is_active;
        this.created_at = created_at;
        this.end_time = end_time;
        this.buy_now_price = buy_now_price;
        this.bidder = bidder;
        this.top_bidder = top_bidder;
        this.history = history;
        this.otherProducts = otherProducts;
    }
}

export class ProductProfile {
    constructor(product_id, name, image_cover_url, current_price, buy_now_price = null, is_active, created_at, end_time, top_bidder, history_count) {
        this.product_id = product_id;
        this.name = name;
        this.image_cover_url = image_cover_url;
        this.current_price = current_price;
        this.buy_now_price = buy_now_price;
        this.is_active = is_active;
        this.created_at = created_at;
        this.end_time = end_time;
        this.top_bidder = top_bidder;
        this.history_count = history_count;
    }  
  constructor(
    product_id,
    seller,
    name,
    description,
    starting_price,
    buy_now_price,
    step_price,
    current_price,
    image_cover_url,
    extra_image_url = [],
    is_active,
    created_at,
    end_time,
    bidder,
    top_bidder,
    history = []
  ) {
    this.product_id = product_id;
    this.seller = seller;
    this.name = name;
    this.description = description;
    this.starting_price = starting_price;
    this.step_price = step_price;
    this.current_price = current_price;
    this.image_cover_url = image_cover_url;
    this.extra_image_url = extra_image_url;
    this.is_active = is_active;
    this.created_at = created_at;
    this.end_time = end_time;
    this.buy_now_price = buy_now_price;
    this.bidder = bidder;
    this.top_bidder = top_bidder;
    this.history = history;
  }
}

export class ProductProfile {
  constructor(
    product_id,
    name,
    image_cover_url,
    current_price,
    buy_now_price = null,
    is_active,
    created_at,
    end_time
  ) {
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

export class WatchList {
  constructor(user_id, products = []) {
    this.user_id = user_id;
    this.products = products;
  }
}

export class otherProductsInfo {
    constructor(product_id, name, image_cover_url, step_price, current_price, buy_now_price = null, is_active, created_at, end_time, top_bidder, history_count) {
        this.product_id = product_id;
        this.name = name;
        this.image_cover_url = image_cover_url;
        this.current_price = current_price;
        this.buy_now_price = buy_now_price;
        this.step_price = step_price;
        this.is_active = is_active;
        this.created_at = created_at;
        this.end_time = end_time;
        this.top_bidder = top_bidder;
        this.history_count = history_count;
    }
}