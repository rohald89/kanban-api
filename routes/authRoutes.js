const express = require('express');
const router = express.Router();
const { login, refresh, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter')

router.route('/')
    .post(loginLimiter, login)

router.route('/refresh')
    .get(refresh)

router.route('/logout')
    .post(logout)

router.route('/forgot')
    .post(forgotPassword)

router.route('/reset')
    .post(resetPassword)

module.exports = router
