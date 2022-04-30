const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this.container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const commentUseCase = this.container.getInstance(ReplyUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addedReply = await commentUseCase.addReply(request.payload, threadId, commentId, userId);

    return h.response({
      status: 'success',
      data: {
        addedReply,
      },
    }).code(201);
  }

  async deleteReplyHandler(request) {
    const commentUseCase = this.container.getInstance(ReplyUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    await commentUseCase.deleteReply(replyId, threadId, commentId, userId);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
