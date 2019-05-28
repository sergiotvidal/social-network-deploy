'use strict';

const addFriendRequest = require('./user_add_friend_request_controller');
const avatarController = require('./user_avatar_controller');
const postController = require('./user_post_controller');
const profileControllers = require('./user_profile_controller');
const wallController = require('./user_wall_controller');

const { profileController, updateProfileController } = profileControllers;

module.exports = {
  addFriendRequest,
  avatarController,
  postController,
  profileController,
  updateProfileController,
  wallController,
};
