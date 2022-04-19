class Comment {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id,
      content,
      date,
      username,
      replies = [],
      isDelete = false,
    } = payload;

    this.id = id;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
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
    isDelete = false,
  }) {
    if (!id || !content || !date || !username || !replies || !(isDelete || isDelete === false)) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || !(date instanceof Date)
      || typeof username !== 'string' || !Array.isArray(replies) || typeof isDelete !== 'boolean') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
