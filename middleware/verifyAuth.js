const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.authorization

    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1] // split on the space to get the "Bearer " part off the header

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            console.log(decoded)
            if(err) return res.status(403).json({ message: 'Forbidden' });
            req.user = {
                emailAddress: decoded.user.emailAddress,
                id: decoded.user.id
            }
            next();
        }
    );
}

module.exports = verifyAuth
