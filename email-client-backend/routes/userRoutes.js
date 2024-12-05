require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { getUserByEmail, createUser, getUserById, updateUser, updateUserPassword, deleteUser } = require('../models/userModel');
const verifyAdmin = require('../middleware/adminMiddleware');
const verifyToken = require('../middleware/authMiddleware'); // Import verifyToken

const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware to verify JWT
// Remove the duplicate verifyToken declaration

// User Registration (Sign Up)
router.post('/signup', async (req, res) => {
    const { firstName, secondName, username, password } = req.body;
    const email = `${username}@swar.com`;

    try {
        // Check if the user already exists
        const userExists = await getUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database with default role 'user'
        await createUser(firstName, secondName, username, email, hashedPassword);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login (Sign In)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin-specific route example
router.get('/admin/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await pool.query('SELECT id, first_name, second_name, username, email, role FROM users WHERE deleted_at IS NULL');
        res.status(200).json(users.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin-specific route to update user details
router.put('/admin/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { firstName, secondName, role, password } = req.body;

    try {
        // Check if the user exists
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use existing values if new values are not provided
        const updatedFirstName = firstName || user.first_name;
        const updatedSecondName = secondName || user.second_name;
        const updatedRole = role || user.role;

        // Update the user details without changing username and email
        await updateUser(id, updatedFirstName, updatedSecondName, user.username, user.email, updatedRole);

        // Update the password only if a new password is provided
        if (password) {
            const updatedPasswordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
            await updateUserPassword(id, updatedPasswordHash);
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin-specific route to update user name
router.put('/admin/users/:id/name', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { firstName, secondName } = req.body;

    try {
        // Check if the user exists
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use existing values if new values are not provided
        const updatedFirstName = firstName || user.first_name;
        const updatedSecondName = secondName || user.second_name;

        // Update the user's name
        await updateUser(id, updatedFirstName, updatedSecondName, user.username, user.email, user.role);

        res.status(200).json({ message: 'User name updated successfully' });
    } catch (error) {
        console.error('Error updating user name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin-specific route to update user role
router.put('/admin/users/:id/role', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        // Check if the user exists
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use existing value if new value is not provided
        const updatedRole = role || user.role;

        // Update the user's role
        await updateUser(id, user.first_name, user.second_name, user.username, user.email, updatedRole);

        res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin-specific route to update user password
router.put('/admin/users/:id/password', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        // Check if the user exists
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password
        await updateUserPassword(id, hashedPassword);

        res.status(200).json({ message: 'User password updated successfully' });
    } catch (error) {
        console.error('Error updating user password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin-specific route to delete a user
router.delete('/admin/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the user exists
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Soft delete the user
        await deleteUser(id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User-specific route to update their own information
router.put('/profile', verifyToken, async (req, res) => {
    const { firstName, secondName, password } = req.body;

    try {
        // Check if the user exists
        const user = await getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use existing values if new values are not provided
        const updatedFirstName = firstName || user.first_name;
        const updatedSecondName = secondName || user.second_name;

        // Update the user details without changing username and email
        await updateUser(req.user.id, updatedFirstName, updatedSecondName, user.username, user.email, user.role);

        // Update the password only if a new password is provided
        if (password) {
            const updatedPasswordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
            await updateUserPassword(req.user.id, updatedPasswordHash);
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected Route Example
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
