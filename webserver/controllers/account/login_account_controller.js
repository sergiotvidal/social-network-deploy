'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mysqlPool = require('../../../databases/mysql-pool');

async function validateSchema(payload) {
  const schema = {
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string().email({ minDomainAtoms: 2 }),
  };

  return Joi.validate(payload, schema);
}

async function loginUser(req, res) {
  const loginData = req.body;

  const { email, password } = req.body;

  // CHECK DE LOS DATOS

  try {
    await validateSchema(loginData);
  } catch (e) {
    return res.status(400).send(e);
  }

  // eslint-disable-next-line max-len
  // Ahora habría que hacer una consulta a la base de datos creada, y comprobar que el mail obtenido en la req.body sea igual que el mail obtenido de la consulta

  // busca una conexión con la base de datos

  const connection = await mysqlPool.getConnection();

  const sqlQuery = 'SELECT * FROM users WHERE email = ?';

  try {
    const [resultado] = await connection.query(sqlQuery, email);

    if (resultado[0].verified_at === null) {
      return res.status(401).send('You have to activate your account');
    }

    connection.release();

    // PASSWORD CHECKER

    const passCheck = await bcrypt.compare(
      password,
      resultado[0].password
    );

    if (passCheck === false) {
      return res.status(401).send('Wrong password');
    }

    // JSON WEB TOKEN

    const tokenData = {
      uuid: resultado[0].uuid,
    };

    const expiresIn = 60 * 60 * 24;

    const token = jwt.sign(tokenData, process.env.JWT_PASSWORD, {
      expiresIn,
    });

    res.json({ token, expiresIn });

    return res.status(200).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(400).send(e.message);
  }
}

module.exports = loginUser;
