const express = require('express');
const { getAllColumns, createColumn, updateColumn, deleteColumn } = require('../controllers/columnController');
// const verifyAuth = require('../middleware/verifyAuth');

const router = express.Router();

// router.use(verifyAuth)

router.route('/')
    .get(getAllColumns)
    .post(createColumn)

router.route('/:id')
    .patch(updateColumn)
    .delete(deleteColumn);

module.exports = router;
