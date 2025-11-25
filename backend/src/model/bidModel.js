export class BidHistory {
    constructor(bid_at, bidder, avatar_url, price) {
        this.bid_at = bid_at;
        this.bidder = bidder;
        this.avatar_url = avatar_url;
        this.price = price;
    }
}

export class HighestBidInfo {
    constructor(highest_price) {
        this.highest_price = highest_price;
    } 
}

export class TopBidder {
    constructor(username, avatar_url, points) {
        this.username = username;
        this.avatar_url = avatar_url;
        this.points = points;
    }
}