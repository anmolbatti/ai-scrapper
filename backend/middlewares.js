const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({status: false, message: "Authorization token is missing!"})

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(401).json({status: false, message: "Invalid Token!"})
        
        req.user = user;
        next();
    });
}

module.exports = {checkAuth};