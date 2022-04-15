const Thread = require('../Thread');

describe('an Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 21,
      title: 123,
      body: true,
      date: {},
      username: 12,
      comments: {},
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const {
      id,
      title,
      body,
      date,
      username,
      comments,
    } = new Thread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
