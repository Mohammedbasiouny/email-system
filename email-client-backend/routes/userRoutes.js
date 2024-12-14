const express = require('express');
const {
    signup, login, getUsers, updateUserDetails, updateUserName, updateUserRole, updateUserPassword, deleteUser, updateProfile, getProfile
} = require('../controllers/userController');
const verifyAdmin = require('../middleware/adminMiddleware');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// User Registration (Sign Up)
router.post('/signup', signup);

// User Login (Sign In)
router.post('/login', login);

// User-specific routes
router.use(verifyToken);
router.put('/profile', updateProfile);
router.get('/profile', getProfile);

// Admin-specific routes
router.use(verifyToken, verifyAdmin);
router.get('/admin/users', getUsers);
router.put('/admin/users/:id', updateUserDetails);
router.put('/admin/users/:id/name', updateUserName);
router.put('/admin/users/:id/role', updateUserRole);
router.put('/admin/users/:id/password', updateUserPassword);
router.delete('/admin/users/:id', deleteUser);

module.exports = router;
