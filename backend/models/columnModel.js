const { Schema, model } = require('mongoose');
const Task = require('./taskModel');


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

columnSchema.pre("deleteOne", { document: true }, async function (next) {
    console.log("deleteOne pre hook", this._id);
    await Task.deleteMany({ status: this._id });
    // console.log(tasks);
    next();
})

const Column = model("Column", columnSchema);
module.exports = {Column};
