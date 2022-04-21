const container = require('../src/Infrastructures/container');
const pool = require('../src/Infrastructures/database/postgres/pool');
const createServer = require('../src/Infrastructures/http/createServer');

/* istanbul ignore file */
const RegisterHelper = {
  async getUserIdAndAccessToken() {
    const server = await createServer(container);

    const registerResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    const registerResponseJson = JSON.parse(registerResponse.payload);
    const userId = registerResponseJson.data.addedUser.id;

    const authResponnse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const authResponseJson = JSON.parse(authResponnse.payload);
    const { accessToken } = authResponseJson.data;

    return { userId, accessToken };
  },

  async cleanTable() {
    await pool.query('DELETE FROM authentications');
    await pool.query('DELETE FROM users');
  },
};

module.exports = RegisterHelper;
