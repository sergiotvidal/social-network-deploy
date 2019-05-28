'use strict';

const mysqlPool = require('../../../databases/mysql-pool');

async function activateAccount(req, res) {
  const { verification_code: verificationCode } = req.query;
  const connection = await mysqlPool.getConnection();

  const sqlQuery = 'SELECT * FROM users_activation WHERE verification_code = ?';

  try {
    const [resultado] = await connection.query(sqlQuery, verificationCode);

    const now = new Date();
    const verificationDate = now.toISOString().substring(0, 19).replace('T', ' ');

    const sqlUpdate = `UPDATE users_activation SET verified_at = ? WHERE verification_code = '${verificationCode}'`;
    await connection.query(sqlUpdate, [verificationDate]);

    const sqlUpdate2 = `UPDATE users SET verified_at = ? WHERE uuid = '${resultado[0].user_uuid}'`;
    await connection.query(sqlUpdate2, [verificationDate]);
    connection.release();

    return res.status(201).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = activateAccount;
