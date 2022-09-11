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

taskSchema.pre("updateOne", { document: true }, async function (next) {
    // New status
    const { status } = this._update;
    console.log('Task Id', this._conditions._id);
    // If status is changed

    if (status) {
        // Remove task from old column
        await Column.updateOne({ tasks: this._conditions._id }, { $pull: { tasks: this._conditions._id } });
        // await Column.updateOne({ _id: this.status }, { $pull: { tasks: this._conditions._id } });
        // Add task to new column
        await Column.updateOne({ _id: this._update.status }, { $push: { tasks: this._conditions._id } });
    }

    // if (status) {
    //     await Column.updateOne({ _id: prevStatus }, { $pull: { tasks: this._id } });
    //     await Column.updateOne({ _id: status }, { $push: { tasks: this._id } });
    // }
    next();
})



const Task = model('Task', taskSchema);
module.exports = Task;
