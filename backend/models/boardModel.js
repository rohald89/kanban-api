const { Schema, model } = require('mongoose');


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
    // tasks: [taskSchema],
})

const Board = model('Board', boardSchema);

module.exports = { Board };
