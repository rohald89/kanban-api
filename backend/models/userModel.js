const { Schema, model } = require('mongoose');

const userSchema = Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    boards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Board'
        }
    ]
})

module.exports = model('User', userSchema)
