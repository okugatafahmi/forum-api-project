const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addLike(commentId, userId) {
    const id = `like-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await this.pool.query(query);
  }

  async deleteLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this.pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
