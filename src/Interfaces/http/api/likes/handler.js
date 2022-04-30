const UpdateCommentLikeUseCase = require('../../../../Applications/use_case/UpdateCommentLikeUseCase');

class LikesHandler {
  constructor(container) {
    this.container = container;

    this.updateCommentLikeHandler = this.updateCommentLikeHandler.bind(this);
  }

  async updateCommentLikeHandler(request) {
    const updateCommentLikeUseCase = this.container.getInstance(UpdateCommentLikeUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await updateCommentLikeUseCase.execute(threadId, commentId, userId);

    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;
