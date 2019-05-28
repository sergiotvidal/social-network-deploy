/* eslint-disable max-len */

'use strict';

const Joi = require('joi');
const PostModel = require('../../../models/post_model');
const WallModel = require('../../../models/wall_model');

async function validate(payload) {
  const schema = {
    content: Joi.string().min(1).max(1024).required(),
  };

  return Joi.validate(payload, schema);
}

async function createPostController(req, res, next) {
  const postData = { ...req.body }; // hace una copia del objeto req.body

  const uuid = req.token;

  try {
    await validate(postData);
  } catch (e) {
    return res.status(400).send(e.message);
  }

  const data = {
    owner: uuid,
    author: uuid,
    content: postData.content,
    likes: [],
    comments: [],
    deletedAt: null,
  };

  try {
    const postCreated = await PostModel.create(data);

    const filter = {
      uuid,
    };

    const operation = {
      $addToSet: {
        posts: postCreated._id,
      },
    };

    await WallModel.findOneAndUpdate(filter, operation); // si después del operation queremos que si no existe, pasamos un { upsert: true }

    return res.status(201).send(postCreated);
  } catch (e) {
    res.status(500).send(e.message);
  }

  return res.status(201).send();
}

module.exports = createPostController;
