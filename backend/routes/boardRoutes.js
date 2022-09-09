const express = require('express');
const { getAllBoards, createBoard, updateBoard, deleteBoard, getSingleBoard } = require('../controllers/boardController');

const router = express.Router();

router.route('/')
    .get(getAllBoards)
    .post(createBoard)

router.route('/:id')
    .get(getSingleBoard)
    .patch(updateBoard)
    .delete(deleteBoard);

module.exports = router;
