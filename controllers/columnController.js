const Board = require('../models/boardModel');
const Column = require('../models/columnModel');

/**
 * @desc Create new column
 * @route POST /columns
 * @access Private
 */
const createColumn = async(req, res) => {
    const { name, boardId } = req.body;

    if(!boardId || !name) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const board = await Board.findById(boardId);

    if(!board) {
        return res.status(400).json({ message: 'Board not found' });
    }
    if(board.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const column = await Column.create({ user: req.user.id, name, boardId });
    await board.columns.push(column._id);

    await board.save();
    if(column) {
        res.status(201).json(column);
    } else {
        res.status(400).json({ message: 'Column not created' });
    }
}

/**
 * @desc Update column
 * @route PATCH /columns
 * @access Private
 */
const updateColumn = async(req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({ message: 'Column ID required' });
    }
    const column = await Column.findById(id).exec();

    if(req.user.id !== column.user.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(!column) {
        return res.status(400).json({ message: 'Column not found' });
    }

    column.name = name;

    const updatedColumn = await column.save();

    res.json({ message: `Column ${updatedColumn.name} updated`});
}
/**
 * @desc Delete column
 * @route DELETE /columns
 * @access Private
 */
const deleteColumn = async(req, res) => {
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({ message: 'Column ID required' });
    }

    const column = await Column.findById(id).exec();

    if(req.user.id !== column.user.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(!column) {
        return res.status(400).json({ message: 'Column not found' });
    }

    await column.deleteOne();
    res.json({ message: `Column ${column.name} deleted`});
}

module.exports = { createColumn, updateColumn, deleteColumn }
