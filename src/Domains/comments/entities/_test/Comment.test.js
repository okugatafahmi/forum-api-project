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
      isDelete: false,
      replies: [],
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      isDelete: false,
      replies: [],
    };

    // Action
    const {
      id,
      content,
      date,
      username,
      isDelete,
      replies,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(isDelete).toEqual(payload.isDelete);
    expect(replies).toEqual(payload.replies);
  });
});
