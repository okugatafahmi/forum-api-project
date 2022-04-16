class Comment {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id,
      content,
      date,
      username,
      replies = [],
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
  }

  verifyPayload({
    id,
    content,
    date,
    username,
    replies = [],
  }) {
    if (!id || !content || !date || !username || !replies) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || !(date instanceof Date)
      || typeof username !== 'string' || !Array.isArray(replies)) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
