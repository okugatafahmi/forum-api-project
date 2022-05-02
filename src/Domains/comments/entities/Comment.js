class Comment {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id,
      content,
      date,
      username,
      isDelete,
      likeCount,
      replies = [],
    } = payload;

    this.id = id;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.date = date;
    this.username = username;
    this.replies = replies;
    this.likeCount = likeCount;
  }

  verifyPayload({
    id,
    content,
    date,
    username,
    likeCount,
    replies = [],
    isDelete,
  }) {
    if (!id || !content || !date || !username || !replies || !(isDelete || isDelete === false)
      || !(likeCount || likeCount === 0)) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || !(date instanceof Date)
      || typeof username !== 'string' || !Array.isArray(replies) || typeof isDelete !== 'boolean'
      || typeof likeCount !== 'number') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
