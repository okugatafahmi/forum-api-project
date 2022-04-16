const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async addThread(useCasePayload, userId) {
    const addThread = new AddThread(useCasePayload);
    return this.threadRepository.addThread(addThread, userId);
  }

  async getThread(id) {
    const thread = await this.threadRepository.getThreadById(id);
    thread.comments = await this.commentRepository.getCommentsByThreadId(id);
    return thread;
  }
}

module.exports = ThreadUseCase;
