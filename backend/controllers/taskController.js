// const {Task} = require('../models/boardModel');

const { Board } = require('../models/boardModel');
const Task = require('../models/taskModel');

/**
 * @desc Get all tasks
 * @route GET /tasks
 * @access Private
 */
 const getAllTasks = async(req, res) => {
    const tasks = await Task.find().populate('board');
    if(!tasks.length) {
        return res.status(400).json({ message: 'No tasks found' });
    }

    // const tasks =
    res.status(200).json(tasks);
}

/**
 * @desc Get single Task
 * @route GET /tasks
 * @access Private
 */
 const getSingleTask = async(req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate('subtasks').exec();
    // if(!tasks.length) {
    //     return res.status(400).json({ message: 'No tasks found' });
    // }

    // const tasks =
    res.status(200).json(task);
}

/**
 * @desc Create new task
 * @route POST /tasks
 * @access Private
 */
const createTask = async(req, res) => {
    console.log('createTask', req.body)
    const { title, description, status, boardId } = req.body;
    const task = await Task.create({ title, description, status, boardId })

    const board = await Board.findById(boardId).exec();
    board.tasks.push(task._id);
    board.save();
    if(task) {
        res.status(201).json(task);
    } else {
        res.status(400).json({ message: 'Task not created' });
    }
}

/**
 * @desc Update task
 * @route PATCH /tasks
 * @access Private
 */
const updateTask = async(req, res) => {
    const { user, name } = req.body;
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({ message: 'Task ID required' });
    }
    const task = await Task.findById(id).exec();

    if(!task) {
        return res.status(400).json({ message: 'Task not found' });
    }

    task.name = name;
    const updatedTask = await task.save();

    res.json({ message: `Task ${updatedTask.name} updated`});
}
/**
 * @desc Delete task
 * @route DELETE /tasks
 * @access Private
 */
const deleteTask = async(req, res) => {
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({ message: 'Task ID required' });
    }

    const task = await Task.findById(id).exec();

    if(!task) {
        return res.status(400).json({ message: 'Task not found' });
    }

    const deletedTask = await task.deleteOne();
    res.json({ message: `Task ${deletedTask.name} deleted`});
}

module.exports = { getAllTasks, getSingleTask, createTask, updateTask, deleteTask }
