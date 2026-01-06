export class Comment {
    constructor(comment_id, user_id, username, user_avatar_url, content, posted_at, parent_id, replies = []) {
        this.comment_id = comment_id;
        this.user_id = user_id;
        this.username = username;
        this.user_avatar_url = user_avatar_url;
        this.content = content;
        this.posted_at = posted_at;
        this.parent_id = parent_id;
        this.replies = replies;
    }
}