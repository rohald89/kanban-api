const Board = require('../models/boardModel');

/**
 * @desc Get all boards
 * @route GET /boards
 * @access Private
 */
const getAllBoards = async(req, res) => {
    const boards = await Board.find({ user: req.user.id }).populate('tasks');
    if(!boards.length) {
        return res.status(400).json({ message: 'No boards found' });
    }
    res.status(200).json(boards);
}

/**
 * @desc Get single board
 * @route GET /boards/:id
 * @access Private
 */
const getSingleBoard = async(req, res) => {
    const { id } = req.params;


    if(!id) {
        return res.status(400).json({ message: 'Board ID required' });
    }

    const board = await Board.findById(id)
        .populate({
            path: 'columns',
            populate: { path: 'tasks', model: 'Task', select: '_id name'},
            select: '_id name tasks'})
        .populate({ path: 'tasks', populate: {path: 'status', model: 'Column', select: 'name' }})
        .exec();

    if(req.user.id !== board.user.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if(!board) {
        return res.status(400).json({ message: 'No board found' });
    }

    res.status(200).json(board);
}

/**
 * @desc Create new board
 * @route POST /boards
 * @access Private
 */
const createBoard = async(req, res) => {
    const { name } = req.body;
    const board = await Board.create({ user: req.user.id, name })
    if(board) {
        res.status(201).json(board);
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
    const { name } = req.body;
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({ message: 'Board ID required' });
    }
    const board = await Board.findById(id).exec();

    if(req.user.id !== board.user.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

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
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({ message: 'Board ID required' });
    }

    const board = await Board.findById(id).exec();
    if(req.user.id !== board.user.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if(!board) {
        return res.status(400).json({ message: 'Board not found' });
    }

    const deletedBoard = await board.deleteOne();
    res.json({ message: `Board ${deletedBoard.name} deleted`});
}


module.exports = {
    getAllBoards,
    getSingleBoard,
    createBoard,
    updateBoard,
    deleteBoard,
}
