class Comment {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id,
      content,
      date,
      username,
      isDelete = false,
      replies = [],
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.isDelete = isDelete;
    this.replies = replies;
  }

  verifyPayload({
    id,
    content,
    date,
    username,
    isDelete = false,
    replies = [],
  }) {
    if (!id || !content || !date || !username
      || !(isDelete || isDelete === false) || !replies) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || !(date instanceof Date)
      || typeof username !== 'string' || typeof isDelete !== 'boolean' || !Array.isArray(replies)) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
