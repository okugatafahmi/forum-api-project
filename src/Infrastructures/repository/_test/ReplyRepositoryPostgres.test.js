const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  const userId = 'user-123';
  const commentId = 'comment-123';

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'sebuah reply',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(addReply, commentId, userId);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'sebuah reply',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply, commentId, userId);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should soft delete reply from database', async () => {
      // Arrange
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply({ id: replyId, userId, commentId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].isDelete).toEqual(true);
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should return empty array when no reply', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds(['comment-123']);

      // Assert
      expect(replies).toEqual([]);
    });

    it('should get replies from database', async () => {
      // Arrange
      const expectedReply = {
        id: 'reply-123',
        content: 'sebuah balasan',
        date: new Date(),
        username: 'dicoding',
      };
      await RepliesTableTestHelper.addReply({ ...expectedReply, userId, commentId });
      // second comment & second reply
      const commentId2 = 'comment-124';
      await CommentsTableTestHelper.addComment({ id: commentId2, threadId: 'thread-123', userId: 'user-123' });
      const expectedReply2 = {
        id: 'reply-124',
        content: 'sebuah balasan 2',
        date: new Date(),
        username: 'dicoding',
      };
      await RepliesTableTestHelper.addReply({ ...expectedReply2, userId, commentId: commentId2 });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds(['comment-123', 'comment-124']);

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0]).toStrictEqual({ ...expectedReply, commentId, isDelete: false });
      expect(replies[1]).toStrictEqual({
        ...expectedReply2,
        commentId: commentId2,
        isDelete: false,
      });
    });

    it('should get replies from database correctly when reply has been deleted', async () => {
      // Arrange
      const expectedReply = {
        id: 'reply-123',
        content: 'sebuah balasan',
        date: new Date(),
        username: 'dicoding',
      };
      await RepliesTableTestHelper.addReply({
        id: expectedReply.id,
        content: expectedReply.content,
        date: expectedReply.date,
        userId: 'user-123',
        commentId,
        isDelete: true,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds(['comment-123']);

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual({ ...expectedReply, commentId, isDelete: true });
    });
  });

  describe('verifyReplyOwner', () => {
    const replyId = 'reply-123';
    beforeEach(async () => {
      await RepliesTableTestHelper.addReply({ id: replyId, userId, commentId });
    });

    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-999', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when reply not owned', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, 'user-999'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError nor AuthorizationError when reply found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, 'user-123'))
        .resolves.not.toThrow(NotFoundError);
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, 'user-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
});
