const express = require('express');
const { getAllTasks, createTask, updateTask, deleteTask, getSingleTask } = require('../controllers/taskController');
// const verifyAuth = require('../middleware/verifyAuth');

const router = express.Router();

// router.use(verifyAuth)

router.route('/')
    .get(getAllTasks)
    .post(createTask)

router.route('/:id')
    .get(getSingleTask)
    .patch(updateTask)
    .delete(deleteTask);

module.exports = router;
