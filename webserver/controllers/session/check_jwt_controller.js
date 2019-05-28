'use strict';

const jwt = require('jsonwebtoken');
const atob = require('atob');

function tokenChecker(req, res, next) {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader === 'undefined') {
    res.status(403).send('Authorization denied');
  }

  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];
  const splitToken = bearerToken.split('.');
  const decodedData = atob(splitToken[1]).split(',');
  const uuidString = decodedData[0].replace(/["{]/g, '').replace(':', ': ');
  const uuidSplit = uuidString.split(' ');
  const uuid = uuidSplit[1];

  req.token = uuid;

  jwt.verify(bearerToken, process.env.JWT_PASSWORD, (err) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    return next();
  });
}


module.exports = tokenChecker;
