const { getUserById } = require('../models/userModel');

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await getUserById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (error) {
        console.error('Error verifying admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = verifyAdmin;