require('dotenv').config();
const express = require('express');
const { sendEmail, getInboxEmails, getSentEmails, markEmailAsRead } = require('../models/emailModel');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Send Email
router.post('/send', verifyToken, async (req, res) => {
    const { receiverId, subject, body, cc } = req.body;

    try {
        await sendEmail(req.user.id, receiverId, cc, subject, body);
        res.status(201).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch Inbox Emails
router.get('/inbox', verifyToken, async (req, res) => {
    try {
        const inbox = await getInboxEmails(req.user.id);
        res.status(200).json(inbox);
    } catch (error) {
        console.error('Error fetching inbox emails:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch Sent Emails
router.get('/sent', verifyToken, async (req, res) => {
    try {
        const sent = await getSentEmails(req.user.id);
        res.status(200).json(sent);
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Mark Email as Read
router.put('/read/:id', verifyToken, async (req, res) => {
    const emailId = req.params.id;

    try {
        await markEmailAsRead(emailId, req.user.id);
        res.status(200).json({ message: 'Email marked as read' });
    } catch (error) {
        console.error('Error marking email as read:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
