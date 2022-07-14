 const jwt = require('jsonwebtoken');
 
 const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({message: 'No Token provided!'})

    // verift jwt token
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) return res.status(401).status({message: 'Unauthorized!'})
        req.userId = decode.id;
        next();
    })
 }

 module.exports = {verifyToken};