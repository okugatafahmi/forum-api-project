class UpdateCommentLikeUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this.likeRepository = likeRepository;
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(threadId, commentId, userId) {
    await this.threadRepository.verifyThreadId(threadId);
    await this.commentRepository.verifyCommentId(commentId);
    try {
      await this.likeRepository.deleteLike(commentId, userId);
    } catch (err) {
      await this.likeRepository.addLike(commentId, userId);
    }
  }
}

module.exports = UpdateCommentLikeUseCase;
