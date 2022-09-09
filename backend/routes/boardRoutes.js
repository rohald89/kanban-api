const express = require('express');
const { getAllBoards, createBoard, updateBoard, deleteBoard } = require('../controllers/boardController');

const router = express.Router();

router.route('/')
    .get(getAllBoards)
    .post(createBoard)
    .patch(updateBoard)
    .delete(deleteBoard);

module.exports = router;
