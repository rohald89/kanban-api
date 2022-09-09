const express = require('express');
const { getAllBoards } = require('../controllers/boardController');

const router = express.Router();

router.route('/')
    .get(getAllBoards)

module.exports = router;
