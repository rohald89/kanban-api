const { Schema, model } = require('mongoose');

const subTaskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
    }
});

const SubTask = model('Subtask', subTaskSchema);
module.exports = SubTask
