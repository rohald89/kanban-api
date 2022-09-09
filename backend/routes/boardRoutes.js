const express = require('express');
const { getAllBoards, createBoard, updateBoard, deleteBoard, getSingleBoard } = require('../controllers/boardController');
const verifyAuth = require('../middleware/verifyAuth');

const router = express.Router();

router.use(verifyAuth)

router.route('/')
    .get(getAllBoards)
    .post(createBoard)

router.route('/:id')
    .get(getSingleBoard)
    .patch(updateBoard)
    .delete(deleteBoard);

module.exports = router;
