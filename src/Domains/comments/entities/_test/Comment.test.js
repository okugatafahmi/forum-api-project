const Comment = require('../Comment');

describe('an Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 21,
      content: 123,
      date: {},
      username: 12,
      isDelete: {},
      likeCount: true,
      replies: [],
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly with default value', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      date: new Date(),
      username: 'dicoding',
      isDelete: false,
      likeCount: 2,
    };

    // Action
    const {
      id,
      content,
      date,
      username,
      replies,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(replies).toEqual([]);
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      date: new Date(),
      username: 'dicoding',
      isDelete: false,
      likeCount: 0,
      replies: [],
    };

    // Action
    const {
      id,
      content,
      date,
      username,
      likeCount,
      replies,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(likeCount).toEqual(payload.likeCount);
    expect(replies).toEqual(payload.replies);
  });

  it('should create Comment object correctly when isDelete true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      date: new Date(),
      username: 'dicoding',
      likeCount: 2,
      replies: [],
      isDelete: true,
    };

    // Action
    const {
      id,
      content,
      date,
      username,
      likeCount,
      replies,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(likeCount).toEqual(payload.likeCount);
    expect(replies).toEqual(payload.replies);
  });
});
