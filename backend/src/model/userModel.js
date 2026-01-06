export class User {
  constructor(user_id, username, email, role) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.role = role;
  }
}

export class UserSimpleProfile {
  constructor(id, username, avatar_url, points) {
    this.id = id;
    this.username = username;
    this.avatar_url = avatar_url;
    this.points = points;
  }
}