'use strict';

const Joi = require('joi');
const UserModel = require('../../../models/user_model');

async function validate(payload) {
  const schema = {
    uuid: Joi.string().guid({
      version: ['uuidv4'],
    }),
  };
  
  return Joi.validate(payload, schema);
}



module.exports = acceptFriendRequest;
