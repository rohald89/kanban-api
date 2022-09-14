const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @desc Login
 * @route POST /auth
 * @access Public
 */
const login = async (req, res) => {
    const { emailAddress, password } = req.body
    if(!emailAddress || !password ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ emailAddress }).exec()
    if(!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if(!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "user": {
                "emailAddress": foundUser.emailAddress,
                "id": foundUser._id
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
        { "emailAddress": foundUser.emailAddress },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d'}
    );

    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site server
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry set to match refreshToken (7 days)
    });

    res.json({ accessToken })
};

/**
 * @desc Refresh
 * @route GET /auth/refresh
 * @access Public - because access token has expired
 */
const refresh = (req, res) => {
    const cookies = req.cookies

    if(!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            const foundUser = await User.findOne({ emailAddress: decoded.emailAddress });

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

            const accessToken = jwt.sign(
                {
                    "user": {
                        "emailAddress": foundUser.emailAddress,
                        "id": foundUser._id
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            res.json({ accessToken });
        }
    )
}

/**
 * @desc Logout
 * @route POST /auth/logout
 * @access Public- just to clear cookie if exists
 */
const logout = (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204) // No Content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie cleared' });
}

/**
 * @desc Forgot Password
 * @route POST /auth/forgot
 * @access Public
 */
const forgotPassword = async (req, res) => {
    const { emailAddress } = req.body;
    if(!emailAddress) return res.status(400).json({ message: 'Email address is required' });

    const foundUser = await User.findOne({ emailAddress }).exec();
    if(!foundUser) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({_id: foundUser._id}, process.env.RESET_TOKEN_SECRET, { expiresIn: '15m' });

    foundUser.resetToken = resetToken;
    await foundUser.save();

    // ! Send email with resetToken

    res.json({ message: 'Reset token generated', resetToken });
}

/**
 * @desc Reset Password
 * @route POST /auth/reset
 * @access Public
 */
const resetPassword = async (req, res) => {
    const { resetToken, password } = req.body;
    if(!resetToken || !password) return res.status(400).json({ message: 'All fields are required' });

    jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET, async (error, decoded) => {
        if(error) return res.status(403).json({ message: 'Incorrect or expired token' });

        const foundUser = await User.findOne({ resetToken }).exec();
        if(!foundUser) return res.status(404).json({ message: 'No user found with this token' });

        const hashedPassword = await bcrypt.hash(password, 10);
        foundUser.password = hashedPassword;
        foundUser.resetToken = null;
        await foundUser.save();

        res.json({ message: 'Password reset successful' });
    })
}


module.exports = {
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword
}
