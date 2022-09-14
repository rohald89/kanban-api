const bcrypt = require('bcrypt');

const User = require('../models/userModel');

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
// ? Might be able to use this at a later stage for collaboration on a single board
const getAllUsers = async (req, res) =>  {
    const users = await User.find().lean()
    if(!users?.length) {
        return res.status(400).json({ message: "No users found" })
    }
    res.json(users)
};

/**
 * @desc Create new user
 * @route POST /users
 * @access Private
 */
const createNewUser = async (req, res) =>  {
    const { firstName, lastName, emailAddress, password } = req.body;

    // confirm data
    if( !firstName || !lastName || !emailAddress || !password) {
        return res.status(400).json({ message: "All fields are required"})
    }

    // Check for duplicate
    const duplicate = await User.findOne({ emailAddress }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if(duplicate) {
        return res.status(409).json({ message: 'Duplicate emailAddress'})
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userObject = { firstName, lastName, emailAddress, "password": hashedPassword }

    console.log(userObject);
    // create new user
    const user = await User.create(userObject)
    if(user) {
        res.status(201).json({ message: `New account created for ${emailAddress}.` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
};

/**
 * @desc Update a user
 * @route PATCH /users
 * @access Private
 */
const updateUser = async (req, res) =>  {
    const { firstName, lastName, emailAddress, password } = req.body;
    const { id } = req.params;

    if( !firstName || !lastName || !emailAddress) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const user = await User.findById(id).exec();

    if(!user) {
        return res.status(400).json({ message: "User not found" })
    }

    const duplicate = await User.findOne({emailAddress}).collation({ locale: 'en', strength: 2 }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate emailAddress'})
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.emailAddress = emailAddress;

    if(password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.emailAddress} updated!`})
};

/**
 * @desc Delete a user
 * @route DELETE /users
 * @access Private
 */
const deleteUser = async (req, res) =>  {
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({ message: "User ID required" })
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if(note) {
        return res.status(400).json({ message: "User has assigned notes" })
    }
    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({ message: "User not found" })
    }

    const result = await user.deleteOne()
    const reply = `EmailAddress ${result.emailAddress} with ID ${result._id} deleted`

    res.json(reply);
};

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
