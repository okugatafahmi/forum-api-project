const AddedReply = require('../../Domains/replies/entities/AddedReply');
const Reply = require('../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addReply(reply, commentId, userId) {
    const { content } = reply;
    const id = `reply-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies(id, content, comment_id, user_id) VALUES($1, $2, $3, $4) RETURNING id, content, user_id AS owner',
      values: [id, content, commentId, userId],
    };

    const result = await this.pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1',
      values: [id],
    };

    await this.pool.query(query);
  }

  async getRepliesByCommentIds(commentIds) {
    const query = {
      text: `SELECT r.id, content, date, comment_id AS "commentId", is_delete AS "isDelete", u.username FROM replies AS r 
      INNER JOIN users AS u ON u.id = r.user_id WHERE r.comment_id = ANY($1::text[]) ORDER BY date`,
      values: [commentIds],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT user_id AS "userId" FROM replies WHERE id = $1 AND is_delete = FALSE',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
    const reply = result.rows[0];
    if (reply.userId !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
