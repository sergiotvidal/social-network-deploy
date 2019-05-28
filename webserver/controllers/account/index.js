'use strict';

const activateAccount = require('./activate_account_controller');
const createAccount = require('./create_account_controller');
const loginAccount = require('./login_account_controller');

module.exports = {
  activateAccount,
  createAccount,
  loginAccount,
};
