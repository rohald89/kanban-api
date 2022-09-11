const { Schema, model } = require('mongoose');
const { Column } = require('./columnModel');

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
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true }
});

taskSchema.pre("deleteOne", { document: true }, async function (next) {
    await Column.updateOne({ _id: this.status }, { $pull: { tasks: this._id } });
    next();
})


const Task = model('Task', taskSchema);
module.exports = Task;
