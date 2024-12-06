const express = require('express');
const { signup, login, getUsers, updateUserDetails, updateUserName, updateUserRole, updateUserPassword, deleteUser, updateProfile, getProfile } = require('../controllers/userController');
const verifyAdmin = require('../middleware/adminMiddleware');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// User Registration (Sign Up)
router.post('/signup', signup);

// User Login (Sign In)
router.post('/login', login);

// Admin-specific routes
router.get('/admin/users', verifyToken, verifyAdmin, getUsers);
router.put('/admin/users/:id', verifyToken, verifyAdmin, updateUserDetails);
router.put('/admin/users/:id/name', verifyToken, verifyAdmin, updateUserName);
router.put('/admin/users/:id/role', verifyToken, verifyAdmin, updateUserRole);
router.put('/admin/users/:id/password', verifyToken, verifyAdmin, updateUserPassword);
router.delete('/admin/users/:id', verifyToken, verifyAdmin, deleteUser);

// User-specific routes
router.put('/profile', verifyToken, updateProfile);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
