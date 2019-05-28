'use strict';

const dot = require('dot-object');
const Joi = require('joi');
const UserModel = require('../../../models/user_model');


async function profileController(req, res) {
  const uuid = req.token;

  const filter = {
    uuid,
  };

  const projection = {
    _id: 0,
    __v: 0,
  };

  const user = await UserModel.find(filter, projection);

  try {
    return res.status(200).send(user);
  } catch (e) {
    return res.status(400).send(e.message);
  }
}

async function validate(payload) {
  const schema = {
    fullName: Joi.string().min(3).max(128).required(),
    preferences: Joi.object().keys({
      isPublicProfile: Joi.bool().required(),
      linkedIn: Joi.string().allow(null),
      twitter: Joi.string().allow(null),
      github: Joi.string().uri().allow(null),
      description: Joi.string().allow(null),
    }),
  };

  return Joi.validate(payload, schema);
}

async function updateProfileController(req, res, next) {

  const uuid = req.token;

  const userDataProfile = { ...req.body };

  try {
    await validate(userDataProfile);
  } catch (e) {
    return res.status(400).send(e.message);
  }

  try {
    const userDataProfileMongoose = dot.dot(userDataProfile);
    const data = await UserModel.updateOne({ uuid }, userDataProfileMongoose);

    return res.status(204).send(data);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = {
  profileController,
  updateProfileController,
};
