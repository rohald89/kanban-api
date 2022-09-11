const { Board } = require('../models/boardModel');
const { Column } = require('../models/columnModel');

/**
 * @desc Get all boards
 * @route GET /boards
 * @access Private
 */
 const getAllColumns = async(req, res) => {
    const columns = await Column.find();
    if(!columns.length) {
        return res.status(400).json({ message: 'No columns found' });
    }

    // const columns =
    res.status(200).json(columns);
}

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
    board.columns.push(column._id);

    board.save();
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
    const { user, name } = req.body;
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
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({ message: 'Column ID required' });
    }

    const column = await Column.findById(id).exec();

    if(!column) {
        return res.status(400).json({ message: 'Column not found' });
    }

    const deletedColumn = await column.deleteOne();
    res.json({ message: `Column ${deletedColumn.name} deleted`});
}

module.exports = { getAllColumns, createColumn, updateColumn, deleteColumn }
