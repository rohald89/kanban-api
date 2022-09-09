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
    column: {
        type: Schema.Types.ObjectId,
        ref: 'Column',
    },
    subtasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subtask',
        },
    ],
});

module.exports = model('Task', taskSchema);
