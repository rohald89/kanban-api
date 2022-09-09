const Board = require('../models/boardModel');

/**
 * @desc Get all boards
 * @route GET /boards
 * @access Private
 */
const getAllBoards = async(req, res) => {
    const boards = await Board.find().lean();
    if(!boards.length) {
        return res.status(400).json({ message: 'No boards found' });
    }
    res.status(200).json({ boards });
}

/**
 * @desc Create new board
 * @route POST /boards
 * @access Private
 */
const createBoard = async(req, res) => {
    const { user, name } = req.body;
    const board = await Board.create({ name })
    if(board) {
        res.status(201).json({ message: 'Board created' });
    } else {
        res.status(400).json({ message: 'Board not created' });
    }
}

/**
 * @desc Update board
 * @route PATCH /boards
 * @access Private
 */
const updateBoard = async(req, res) => {
    const { id, user, name } = req.body;

    const board = await Board.findById(id).exec();

    if(!board) {
        return res.status(400).json({ message: 'Board not found' });
    }

    board.name = name;
    const updatedBoard = await board.save();

    res.json({ message: `Board ${updatedBoard.name} updated`});
}
/**
 * @desc Delete board
 * @route DELETE /boards
 * @access Private
 */
const deleteBoard = async(req, res) => {
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Board ID required' });
    }

    const board = await Board.findById(id).exec();
    console.log(board)

    if(!board) {
        return res.status(400).json({ message: 'Board not found' });
    }

    const deletedBoard = await board.deleteOne();
    res.json({ message: `Board ${deletedBoard.name} deleted`});
}

module.exports = { getAllBoards, createBoard, updateBoard, deleteBoard }
