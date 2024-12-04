const express = require('express');
const { Pool } = require('pg');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'email_system',
    password: '123',
    port: 5432,
});

// Send Email
router.post('/send', verifyToken, async (req, res) => {
    const { receiverId, subject, body, cc } = req.body;

    try {
        await pool.query(
            'INSERT INTO emails (sender_id, receiver_id, cc, subject, body) VALUES ($1, $2, $3, $4, $5)',
            [req.user.id, receiverId, cc, subject, body]
        );
        res.status(201).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch Inbox Emails
router.get('/inbox', verifyToken, async (req, res) => {
    try {
        const inbox = await pool.query(
            'SELECT * FROM emails WHERE receiver_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.status(200).json(inbox.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch Sent Emails
router.get('/sent', verifyToken, async (req, res) => {
    try {
        const sent = await pool.query(
            'SELECT * FROM emails WHERE sender_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.status(200).json(sent.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Mark Email as Read
router.put('/read/:id', verifyToken, async (req, res) => {
    const emailId = req.params.id;

    try {
        await pool.query('UPDATE emails SET is_read = TRUE WHERE id = $1 AND receiver_id = $2', [
            emailId,
            req.user.id,
        ]);
        res.status(200).json({ message: 'Email marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
