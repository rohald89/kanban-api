const { Schema, model } = require('mongoose');
const Column = require('./columnModel');

const taskSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
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
            title: String,
            isCompleted: Boolean,
        }
    ],
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true }
});

taskSchema.pre("deleteOne", { document: true }, async function (next) {
    await Column.updateOne({ _id: this.status }, { $pull: { tasks: this._id } });
    next();
})

taskSchema.pre("updateOne", { document: true }, async function (next) {
    // New status
    const { status } = this._update;
    const task = this._conditions._id;

    if (status) {
        // Remove task from old column
        await Column.updateOne({ tasks: task }, { $pull: { tasks: task } });
        // Add task to new column
        await Column.updateOne({ _id: this._update.status }, { $push: { tasks: task } });
    }
    next();
})

const Task = model('Task', taskSchema);
module.exports = Task;
