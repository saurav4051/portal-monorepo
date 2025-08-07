const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const authMiddleware = (requiredRoles) => (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send({ error: 'Authorization denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = decoded;

        // Check if the user has the required role
        if (!requiredRoles.includes(req.user.role)) {
            return res.status(403).send({ error: 'Forbidden, insufficient permissions' });
        }

        next();
    } catch (error) {
        res.status(401).send({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;