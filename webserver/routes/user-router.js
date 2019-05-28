'use strict';

const express = require('express');
const multer = require('multer');
const tokenChecker = require('../controllers/session/check_jwt_controller');
const userControllers = require('../controllers/user/index');

const upload = multer();
const router = express.Router();

router.get('/user', tokenChecker, userControllers.profileController);
router.put('/user', tokenChecker, userControllers.updateProfileController);
router.post('/user/avatar', tokenChecker, upload.single('avatar'), userControllers.avatarController);
router.post('/user/friendrequest', tokenChecker, userControllers.addFriendRequest);
router.post('/user/post', tokenChecker, userControllers.postController);
router.get('/user/wall', tokenChecker, userControllers.wallController);

module.exports = router;
