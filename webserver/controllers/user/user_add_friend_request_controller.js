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

async function addFriendRequest(req, res, next) {
  const friendData = { ...req.body };
  const uuid = req.token;

  try {
    await validate(friendData);
  } catch (e) {
    return res.status(400).send(e);
  }

  if (uuid === friendData.uuid) {
    return res.status(409).send();
  }

  const filter = {
    uuid: friendData.uuid,
    friends: {
      $not: {
        $elemMatch: {
          uuid,
        },
      },
    },
  };

  const op = {
    $push: {
      friends: {
        uuid,
        createdAt: Date.now(),
        confirmedAt: null,
        rejectedAt: null,
      },
    },
  };

  try {
    const result = await UserModel.updateOne(filter, op);

    console.log(result);

    return res.status(201).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = addFriendRequest;
