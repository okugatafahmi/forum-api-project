const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addThread(thread, userId) {
    const { title, body } = thread;
    const id = `thread-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads(id, title, body, user_id) VALUES($1, $2, $3, $4) RETURNING id, title, user_id AS owner',
      values: [id, title, body, userId],
    };

    const result = await this.pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadId(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;