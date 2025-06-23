const jwt = require("jsonwebtoken");

const getUserIdByToken = (authHeader) => {
    // const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({status: false, message: "Authorization token is missing!"})

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(401).json({status: false, message: "Invalid Token!"})
        
        req.user = user;
    });
}

module.exports = {getUserIdByToken};