const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this.container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const threadUseCase = this.container.getInstance(ThreadUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedThread = await threadUseCase.addThread(request.payload, userId);

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }

  async getThreadByIdHandler(request) {
    const threadUseCase = this.container.getInstance(ThreadUseCase.name);
    const { threadId } = request.params;
    const thread = await threadUseCase.getThread(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
