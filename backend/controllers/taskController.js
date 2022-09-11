const { Board } = require('../models/boardModel');
const { Column } = require('../models/columnModel');
const Task = require('../models/taskModel');


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

    res.status(200).json(task);
}

/**
 * @desc Create new task
 * @route POST /tasks
 * @access Private
 */
const createTask = async(req, res) => {
    const { title, description, status, boardId } = req.body;
    const task = await Task.create({ title, description, status, boardId })

    const board = await Board.findById(boardId).exec();
    await board.tasks.push(task._id);
    await board.save();

    const column = await Column.findById(status).exec();
    if (column) {
        column.tasks.push(task._id);
        await column.save();
    } else {
        return res.status(400).json({ message: 'Column not found' });
    }

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
    const { title, description, status } = req.body;
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({ message: 'Task ID required' });
    }
    const task = await Task.findById(id).exec();

    if(!task) {
        return res.status(400).json({ message: 'Task not found' });
    }

    task.title = title;
    task.description = description;

    if (status) {
        const column = await Column.findById(status).exec();
        if (column) {
            const prevColumn = await Column.findById(task.status).exec();
            console.log(prevColumn);
            prevColumn.tasks = prevColumn.tasks.filter(taskId => taskId.toString() !== task._id.toString());
            await prevColumn.save();
            column.tasks.push(task._id);
            await column.save();
        }
        task.status = status;
    }
    const updatedTask = await task.save();

    res.json({ message: `Task ${updatedTask.title} updated`});
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

    await task.deleteOne();
    res.json({ message: `Task ${task.title} deleted`});
}

module.exports = { getSingleTask, createTask, updateTask, deleteTask }