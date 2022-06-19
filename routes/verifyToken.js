const jwt = require('jsonwebtoken');  // for generating tokens


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECURED, (err, user) => { 
            if (err) {
                return res.status(401).send({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {    // check if the user is the owner of the post or if the user is an admin    
            next();
        } else {
            return res.status(401).send({ message: 'Unauthorized' });
        }
    })
}

const verifyTokenAndAdmin= (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {    // check if the user is the owner of the post or if the user is an admin    
            next();
        } else {
            return res.status(401).send({ message: 'Unauthorized' });
        }
    })
}
 

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};