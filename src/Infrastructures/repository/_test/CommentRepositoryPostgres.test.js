const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const Comment = require('../../../Domains/comments/entities/Comment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'sebuah comment',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment, threadId, userId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'sebuah comment',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment, threadId, userId);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment from database', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, userId: 'user-123', threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].isDelete).toEqual(true);
    });
  });

  describe('getCommensByThreadId function', () => {
    it('should return empty array when no comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toEqual([]);
    });

    it('should get comments from database', async () => {
      // Arrange
      const expectedComment = new Comment({
        id: 'comment-123',
        content: 'sebuah comment',
        date: new Date(),
        username: 'dicoding',
      });
      await CommentsTableTestHelper.addComment({ ...expectedComment, userId: 'user-123', threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual(expectedComment);
    });

    it('should get comments from database correctly when comment has been deleted', async () => {
      // Arrange
      const expectedComment = new Comment({
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        date: new Date(),
        username: 'dicoding',
      });
      await CommentsTableTestHelper.addComment({
        id: expectedComment.id,
        content: 'sebuah comment',
        date: expectedComment.date,
        userId: 'user-123',
        threadId: 'thread-123',
        isDelete: true,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual(expectedComment);
    });
  });

  describe('verifyCommentOwner', () => {
    const commentId = 'comment-123';
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({ id: commentId, userId: 'user-123', threadId: 'thread-123' });
    });

    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-999', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment not owned', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-999'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError nor AuthorizationError when comment found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-123'))
        .resolves.not.toThrow(NotFoundError);
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
});
