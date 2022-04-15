const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async addThread(useCasePayload, userId) {
    const addThread = new AddThread(useCasePayload);
    return this.threadRepository.addThread(addThread, userId);
  }
}

module.exports = ThreadUseCase;
