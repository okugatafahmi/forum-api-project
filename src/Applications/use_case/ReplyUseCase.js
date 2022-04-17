const AddReply = require('../../Domains/replies/entities/AddReply');

class ReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this.replyRepository = replyRepository;
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async addReply(useCasePayload, threadId, commentId, userId) {
    const addReply = new AddReply(useCasePayload);
    await this.threadRepository.verifyThreadId(threadId);
    await this.commentRepository.verifyCommentId(commentId);
    return this.replyRepository.addReply(addReply, commentId, userId);
  }

  async deleteReply(replyId, threadId, commentId, userId) {
    await this.threadRepository.verifyThreadId(threadId);
    await this.commentRepository.verifyCommentId(commentId);
    await this.replyRepository.verifyReplyOwner(replyId, userId);
    await this.replyRepository.deleteReplyById(replyId);
  }
}

module.exports = ReplyUseCase;
