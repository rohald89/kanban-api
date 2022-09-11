const { Board } = require('../models/boardModel');
const { Column } = require('../models/columnModel');
const Task = require('../models/taskModel');

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

    const column = await Column.create({ name, boardId });
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
    // TODO MAKE SURE THAT ALL TASKS IN THE COLUMN ARE DELETED AS WELL
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({ message: 'Column ID required' });
    }

    const column = await Column.findById(id).exec();

    if(!column) {
        return res.status(400).json({ message: 'Column not found' });
    }

    await column.deleteOne();
    res.json({ message: `Column ${column.name} deleted`});
}

module.exports = { createColumn, updateColumn, deleteColumn }
