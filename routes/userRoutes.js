const express = require('express');
const router = express.Router();

const { createNewUser, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');

router.route('/')
    .get(getAllUsers)
    .post(createNewUser)

router.route('/:id')
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;
