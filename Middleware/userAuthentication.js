const jwt = require('jsonwebtoken');
const User = require('../Models/User.model');

const Authentication = async (req, res, next) => {
    try {
        // Get token from Authorization header
        console.log(req.headers.authorization)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("Access denied, No token provided")
            return res.status(403).json({ message: "Access denied, No token provided" });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('authentication Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(500).json({ 
            message: 'Internal server error',
            details: error.message 
        });
    }
};

module.exports = Authentication;