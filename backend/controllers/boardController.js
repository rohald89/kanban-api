
/**
 * @desc Get all boards
 * @route GET /boards
 * @access Private
 */
const getAllBoards = async(req, res) => {
    console.log('CHECK')
    res.json({ message: "Hello World" })
}

module.exports = { getAllBoards }
