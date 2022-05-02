const Comment = require('../../../Domains/comments/entities/Comment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Reply = require('../../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const userId = 'user-123';
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(new AddedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    })));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await threadUseCase.addThread(useCasePayload, userId);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), userId);
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const expectedThread = new Thread({
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    });
    const expectedComment = new Comment({
      id: commentId,
      content: 'sebuah comment',
      date: new Date(),
      username: 'dicoding',
      isDelete: false,
      likeCount: 0,
    });
    const expectedReply = new Reply({
      id: 'reply-123',
      content: 'sebuah balasan',
      date: new Date(),
      username: 'dicoding',
    });
    expectedComment.replies = [expectedReply];
    expectedThread.comments = [expectedComment];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new Thread({
      id: expectedThread.id,
      title: expectedThread.title,
      body: expectedThread.body,
      date: expectedThread.date,
      username: expectedThread.username,
    })));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([
      {
        id: expectedComment.id,
        content: expectedComment.content,
        date: expectedComment.date,
        username: expectedComment.username,
        isDelete: false,
        likeCount: expectedComment.likeCount,
      },
    ]));
    mockReplyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve([
      {
        id: expectedReply.id,
        content: expectedReply.content,
        date: expectedReply.date,
        username: expectedReply.username,
        commentId: expectedComment.id,
      },
    ]));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await threadUseCase.getThread(threadId);

    // Assert
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith([commentId]);
  });
});
