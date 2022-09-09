const {Schema, model} = require('mongoose');

const boardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    columns: {
        type: [Schema.Types.ObjectId],
        ref: 'Column',
    },
    tasks: {
        type: [Schema.Types.ObjectId],
        ref: 'Task'
    }
})

module.exports = model('Board', boardSchema);
