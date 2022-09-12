const { Schema, model } = require('mongoose');
const { Column } = require('./columnModel');
const Task = require('./taskModel');


const boardSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    columns: [{ type: Schema.Types.ObjectId, ref: 'Column' }],
})

boardSchema.pre("deleteOne", { document: true }, async function (next) {
    await Task.deleteMany({ boardId: this._id });
    await Column.deleteMany({ boardId: this._id });
    next();
})

const Board = model('Board', boardSchema);

module.exports = { Board };
