/* eslint-disable max-len */

'use strict';

const WallModel = require('../../../models/wall_model');
const PostModel = require('../../../models/post_model');

async function wallController(req, res, next) {

  const uuid = req.token;

  const filter = {
    uuid,
  };

  const userWall = await WallModel.find(filter);

  const userPosts = {
    _id: {
      $in: userWall[0].posts,
    },
  };

  const projection = {
    content: 1,
    likes: 1,
    comments: 1,
    _id: 0,
  };

  try {
    const posts = await PostModel.find(userPosts, projection);
    return res.status(200).send(posts);
  } catch (e) {
    return res.status(404).send(e.message);
  }
}

module.exports = wallController;
