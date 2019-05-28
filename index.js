'use strict';

require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const routers = require('./webserver/routes/index');
const mysqlPool = require('./databases/mysql-pool');
const mongoPool = require('./databases/mongo-pool');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  const accessControlAllowMethods = [
    'GET',
    'POST',
    'DELETE',
    'HEAD',
    'PATCH',
    'PUT',
    'OPTIONS',
  ];

  const accessControlAllowHeaders = [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Accept-Version',
    'Authorization',
    'Location',
  ];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', accessControlAllowMethods.join(','));
  res.header('Access-Control-Allow-Headers', accessControlAllowHeaders.join(','));
  res.header('Access-Control-Expose-Headers', accessControlAllowHeaders.join(','));
  next();
});

process.on('uncaughtException', (err) => {
  console.error('excepción inesperada', err.message, err);
});

process.on('unhandledRejection', (err) => {
  console.error('Error inesperado', err.message, err);
});

app.use((err, req, res ,next) => {
  console.error(err);
  res.status(400).send({
    error: err.message,
  });
});

app.use('/api', routers.accountRouter);
app.use('/api', routers.userRouter);

async function init() {
  try {
    await mongoPool.connect();
    await mysqlPool.connect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server running and listening at port ${port}`);
  });
}

init();
