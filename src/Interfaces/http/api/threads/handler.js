const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadHandler {
  constructor(container) {
    this.container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const threadUseCase = this.container.getInstance(ThreadUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedThread = await threadUseCase.addThread(request.payload, userId);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadHandler;
