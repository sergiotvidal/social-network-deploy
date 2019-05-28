'use strict';

/* eslint-disable max-len */

const express = require('express');
const accountControllers = require('../controllers/account/index');

const router = express.Router();

router.post('/account', accountControllers.createAccount);
router.get('/account/activate', accountControllers.activateAccount);
router.post('/account/login', accountControllers.loginAccount);

module.exports = router;
