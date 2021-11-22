const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        // extracts the token from the header
        let accessToken = req.headers.authorization.split(' ')[1];
        // verifies the user token
        const data = jwt.verify(accessToken, process.env.JWT_SECRET);
        // attaches the user id to the request
        res.locals.userId = data.id;
        // move to next middleware
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({
            message: 'Unauthorized user'
        });
    }
};