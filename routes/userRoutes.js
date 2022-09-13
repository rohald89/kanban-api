const express = require('express');
const router = express.Router();

const { createNewUser, updateUser, deleteUser } = require('../controllers/userController');

router.route('/')
    .post(createNewUser)

router.route('/:id')
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;
