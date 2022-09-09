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
});

module.exports = model('Subtask', subTaskSchema);
