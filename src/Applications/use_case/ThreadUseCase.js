const Comment = require('../../Domains/comments/entities/Comment');
const Reply = require('../../Domains/replies/entities/Reply');
const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async addThread(useCasePayload, userId) {
    const addThread = new AddThread(useCasePayload);
    return this.threadRepository.addThread(addThread, userId);
  }

  async getThread(id) {
    const thread = await this.threadRepository.getThreadById(id);
    const comments = await this.commentRepository.getCommentsByThreadId(id);

    const commentIds = comments.map((comment) => comment.id);
    const replies = await this.replyRepository.getRepliesByCommentIds(commentIds);

    thread.comments = comments.map(
      ({ replies: commentReplies, id: commentId, ...restAttributes }) => new Comment({
        replies: replies.filter((reply) => reply.commentId === commentId)
          .map((replyPayload) => new Reply(replyPayload)),
        id: commentId,
        ...restAttributes,
      }),
    );
    return thread;
  }
}

module.exports = ThreadUseCase;
