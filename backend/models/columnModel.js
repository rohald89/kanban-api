const { Schema, model } = require('mongoose');


const columnSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    // color: {
    //     type: String,
    //     required: true,
    // },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Task",
        },
    ],
});

const Column = model("Column", columnSchema);
module.exports = {Column};
