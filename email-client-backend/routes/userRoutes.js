const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'email_system',
    password: '123',
    port: 5432,
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, 'your_secret_key');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// User Registration (Sign Up)
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login (Sign In)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT
        const token = jwt.sign({ id: user.rows[0].id }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected Route Example
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]);
        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
