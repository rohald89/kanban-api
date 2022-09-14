const { Schema, model } = require('mongoose');

const userSchema = Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
        default: null,
    },
    boards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Board'
        }
    ]
})

module.exports = model('User', userSchema)
