class Reply {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id,
      content,
      date,
      username,
      isDelete = false,
    } = payload;

    this.id = id;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
  }

  verifyPayload({
    id,
    content,
    date,
    username,
    isDelete = false,
  }) {
    if (!id || !content || !date || !username || !(isDelete || isDelete === false)) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || !(date instanceof Date) || typeof username !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
