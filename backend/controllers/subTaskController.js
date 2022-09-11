// const {SubTask} = require('../models/boardModel');

const SubTask = require('../models/subTaskModel');

/**
 * @desc Get all boards
 * @route GET /boards
 * @access Private
 */
 const getAllSubTasks = async(req, res) => {
    const subTasks = await SubTask.find().populate('task');
    if(!subTasks.length) {
        return res.status(400).json({ message: 'No subTasks found' });
    }

    // const subTasks =
    res.status(200).json(subTasks);
}

/**
 * @desc Get single SubTask
 * @route GET /tasks
 * @access Private
 */
 const getSingleSubTask = async(req, res) => {
    const { id } = req.params;
    const subtask = await SubTask.findById(id).populate('task').exec();
    // if(!tasks.length) {
    //     return res.status(400).json({ message: 'No tasks found' });
    // }

    // const tasks =
    res.status(200).json(subtask);
}

/**
 * @desc Create new subTask
 * @route POST /subTasks
 * @access Private
 */
const createSubTask = async(req, res) => {
    console.log('createSubTask', req.body)
    const { title, isCompleted, task } = req.body;
    const subTask = await SubTask.create({ title, isCompleted, task })
    if(subTask) {
        res.status(201).json(subTask);
    } else {
        res.status(400).json({ message: 'SubTask not created' });
    }
}

/**
 * @desc Update subTask
 * @route PATCH /subTasks
 * @access Private
 */
const updateSubTask = async(req, res) => {
    const { user, name } = req.body;
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({ message: 'SubTask ID required' });
    }
    const subTask = await SubTask.findById(id).exec();

    if(!subTask) {
        return res.status(400).json({ message: 'SubTask not found' });
    }

    subTask.name = name;
    const updatedSubTask = await subTask.save();

    res.json({ message: `SubTask ${updatedSubTask.name} updated`});
}
/**
 * @desc Delete subTask
 * @route DELETE /subTasks
 * @access Private
 */
const deleteSubTask = async(req, res) => {
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({ message: 'SubTask ID required' });
    }

    const subTask = await SubTask.findById(id).exec();

    if(!subTask) {
        return res.status(400).json({ message: 'SubTask not found' });
    }

    const deletedSubTask = await subTask.deleteOne();
    res.json({ message: `SubTask ${deletedSubTask.name} deleted`});
}

module.exports = { getAllSubTasks, getSingleSubTask, createSubTask, updateSubTask, deleteSubTask }
