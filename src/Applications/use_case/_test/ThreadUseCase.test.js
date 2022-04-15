const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const userId = 'user-123';
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      })));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await threadUseCase.addThread(useCasePayload, userId);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), userId);
  });
});
