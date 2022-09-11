const express = require('express');
const { getAllSubTasks,getSingleSubTask, createSubTask, updateSubTask, deleteSubTask } = require('../controllers/subTaskController');
// const verifyAuth = require('../middleware/verifyAuth');

const router = express.Router();

// router.use(verifyAuth)

router.route('/')
    .get(getAllSubTasks)
    .post(createSubTask)

router.route('/:id')
    .get(getSingleSubTask)
    .patch(updateSubTask)
    .delete(deleteSubTask);

module.exports = router;
