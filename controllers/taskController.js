const Board = require('../models/boardModel');
const Column = require('../models/columnModel');
const Task = require('../models/taskModel');


/**
 * @desc Get single Task
 * @route GET /tasks
 * @access Private
 */
 const getSingleTask = async(req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate('subtasks').exec();

    if(!task) {
        return res.status(400).json({ message: 'Task not found' });
    }
    if(task.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json(task);
}

/**
 * @desc Create new task
 * @route POST /tasks
 * @access Private
 */
const createTask = async(req, res) => {
    const { title, description, status, boardId, subtasks } = req.body;
    const task = await Task.create({ user: req.user.id, title, description, subtasks, status, boardId })

    const board = await Board.findById(boardId).exec();
    if(req.user.id !== board.user.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

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
    const { title, description, subtasks, status, source, destination } = req.body;
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({ message: 'Task ID required' });
    }
    const task = await Task.updateOne({ _id: id }, { title, description, subtasks, status }).exec();

    if(req.user.id !== task.user.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(!task) {
        return res.status(400).json({ message: 'Task not found' });
    }

    if (source && destination) {
        if (source.droppableId === destination.droppableId
            && source.index === destination.index) {
                return res.status(200).json({ message: 'Task updated' });
            }

        if(source.droppableId === destination.droppableId) {
            // ! When moving tasks from 0 -> 1 index task the task on 1 index is being overwritten
            // const column = await Column.findById(source.droppableId).exec();

            // const tasks = [...column.tasks];
            // console.log(tasks);
            // let [oldValue, newValue] = [tasks[source.index], tasks[destination.index]];
            // // console.log(tasks);
            // // tasks.set(source.index, newValue);
            // // console.log(tasks);
            // // tasks.set(destination.index, oldValue);
            // tasks.splice(source.index, 1);
            // console.log(tasks);
            // tasks.splice(destination.index, 0, id);
            // // console.log(tasks);
            // console.log(tasks);
            // column.set({tasks});
            // await column.save();
        } else {
            const sourceColumn = await Column.findById(source.droppableId).exec();
            sourceColumn.tasks.splice(source.index, 1);
            await sourceColumn.save();
            const destinationColumn = await Column.findById(destination.droppableId).exec();
            destinationColumn.tasks.splice(destination.index, 0, id);
            await destinationColumn.save();
        }
    }
    res.json({ message: `Task ${task.title} updated`});
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

    if(req.user.id !== task.user.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(!task) {
        return res.status(400).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: `Task ${task.title} deleted`});
}

module.exports = { getSingleTask, createTask, updateTask, deleteTask }
