const { Schema, model } = require('mongoose');

const taskSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    subtasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subtask',
        },
    ],
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true }
});

const Task = model('Task', taskSchema);
module.exports = Task;
