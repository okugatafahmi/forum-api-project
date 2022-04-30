const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UpdateCommentLikeUseCase = require('../UpdateCommentLikeUseCase');

describe('UpdateCommentLikeUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-123';

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve());
    mockLikeRepository.deleteLike = jest.fn(() => Promise.reject());
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await updateCommentLikeUseCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentId).toBeCalledWith(commentId);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(commentId, userId);
    expect(mockLikeRepository.addLike).toBeCalledWith(commentId, userId);
  });

  it('should orchestrating the delete like action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-123';

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve());
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());
    mockLikeRepository.addLike = jest.fn();

    /** creating use case instance */
    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await updateCommentLikeUseCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentId).toBeCalledWith(commentId);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(commentId, userId);
    expect(mockLikeRepository.addLike).toBeCalledTimes(0);
  });
});
