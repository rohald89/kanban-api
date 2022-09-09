import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    column: {
        type: Schema.Types.ObjectId,
        ref: 'Column',
        required: true,
    },
    subtasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subtask',
        },
    ],
});

module.exports = model('Task', taskSchema);
