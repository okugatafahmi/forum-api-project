const Comment = require('../../Domains/comments/entities/Comment');
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
    thread.comments = await Promise.all((await this.commentRepository.getCommentsByThreadId(id))
      .map(
        async ({ replies, id: commentId, ...restCommentAttributes }) => (new Comment({
          replies: await this.replyRepository.getRepliesByCommentId(commentId),
          id: commentId,
          ...restCommentAttributes,
        })),
      ));
    // thread.comments = await this.commentRepository.getCommentsByThreadId(id);
    return thread;
  }
}

module.exports = ThreadUseCase;
