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
      text: `SELECT c.id, content, date, is_delete AS "isDelete", u.username FROM comments AS c 
      LEFT JOIN users AS u ON u.id = c.user_id WHERE c.thread_id = $1 ORDER BY date`,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    return result.rows.map(({ content, isDelete, ...restCommentAttributes }) => (
      new Comment({ content: (isDelete ? '**komentar telah dihapus**' : content), isDelete, ...restCommentAttributes })
    ));
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
}

module.exports = CommentRepositoryPostgres;
