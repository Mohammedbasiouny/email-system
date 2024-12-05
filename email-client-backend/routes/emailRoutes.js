require('dotenv').config();
const express = require('express');
const { sendEmail, getInboxEmails, getSentEmails, markEmailAsRead, moveToTrash, recoverEmail, getTrashEmails, createFolder, renameFolder, deleteFolder, moveEmailToFolder, replyEmail, replyAllEmail } = require('../models/emailModel');
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

// Move Email to Trash
router.put('/trash/:id', verifyToken, async (req, res) => {
    const emailId = req.params.id;

    try {
        await moveToTrash(emailId, req.user.id);
        res.status(200).json({ message: 'Email moved to trash' });
    } catch (error) {
        console.error('Error moving email to trash:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Recover Email from Trash
router.put('/recover/:id', verifyToken, async (req, res) => {
    const emailId = req.params.id;

    try {
        await recoverEmail(emailId, req.user.id);
        res.status(200).json({ message: 'Email recovered from trash' });
    } catch (error) {
        console.error('Error recovering email from trash:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch Trash Emails
router.get('/trash', verifyToken, async (req, res) => {
    try {
        const trash = await getTrashEmails(req.user.id);
        res.status(200).json(trash);
    } catch (error) {
        console.error('Error fetching trash emails:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create Folder
router.post('/folders', verifyToken, async (req, res) => {
    const { name } = req.body;

    try {
        await createFolder(req.user.id, name);
        res.status(201).json({ message: 'Folder created successfully' });
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Rename Folder
router.put('/folders/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    try {
        await renameFolder(id, req.user.id, newName);
        res.status(200).json({ message: 'Folder renamed successfully' });
    } catch (error) {
        console.error('Error renaming folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete Folder
router.delete('/folders/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        await deleteFolder(id, req.user.id);
        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Move Email to Folder
router.put('/move/:emailId/folder/:folderId', verifyToken, async (req, res) => {
    const { emailId, folderId } = req.params;

    try {
        await moveEmailToFolder(emailId, req.user.id, folderId);
        res.status(200).json({ message: 'Email moved to folder successfully' });
    } catch (error) {
        console.error('Error moving email to folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reply to Email
router.post('/reply/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;

    try {
        await replyEmail(id, req.user.id, body);
        res.status(201).json({ message: 'Reply sent successfully' });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reply All to Email
router.post('/reply-all/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;

    try {
        await replyAllEmail(id, req.user.id, body);
        res.status(201).json({ message: 'Reply All sent successfully' });
    } catch (error) {
        console.error('Error sending reply all:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
