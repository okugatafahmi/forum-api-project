const AddedComment = require('../../Domains/comments/entities/AddedComment');
const Comment = require('../../Domains/comments/entities/Comment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addComment(comment, threadId, userId) {
    const { content } = comment;
    const id = `comment-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments(id, content, thread_id, user_id) VALUES($1, $2, $3, $4) RETURNING id, content, user_id AS owner',
      values: [id, content, threadId, userId],
    };

    const result = await this.pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [id],
    };

    await this.pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, content, date, is_delete AS "isDelete", u.username, COALESCE(l.like_count, 0) AS "likeCount" 
      FROM comments AS c 
      INNER JOIN users AS u ON u.id = c.user_id 
      LEFT JOIN (SELECT comment_id, COUNT(*)::int AS like_count FROM likes GROUP BY comment_id) AS l ON l.comment_id = c.id 
      WHERE thread_id = $1 ORDER BY date`,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT user_id AS "userId" FROM comments WHERE id = $1 AND is_delete = FALSE',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    const comment = result.rows[0];
    if (comment.userId !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyCommentId(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
