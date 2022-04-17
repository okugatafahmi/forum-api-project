const AddComment = require('../../Domains/comments/entities/AddComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async addComment(useCasePayload, threadId, userId) {
    const addComment = new AddComment(useCasePayload);
    await this.threadRepository.verifyThreadId(threadId);
    return this.commentRepository.addComment(addComment, threadId, userId);
  }

  async deleteComment(commentId, threadId, userId) {
    await this.threadRepository.verifyThreadId(threadId);
    await this.commentRepository.verifyCommentOwner(commentId, userId);
    await this.commentRepository.deleteCommentById(commentId);
  }
}

module.exports = CommentUseCase;
