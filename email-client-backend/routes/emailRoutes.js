const express = require('express');
const { sendEmail, getInboxEmails, getSentEmails, markEmailAsRead, moveToTrash, recoverEmail, getTrashEmails, createFolder, renameFolder, deleteFolder, moveEmailToFolder, replyEmail, replyAllEmail } = require('../controllers/emailController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Send Email
router.post('/send', verifyToken, sendEmail);

// Fetch Inbox Emails
router.get('/inbox', verifyToken, getInboxEmails);

// Fetch Sent Emails
router.get('/sent', verifyToken, getSentEmails);

// Mark Email as Read
router.put('/read/:id', verifyToken, markEmailAsRead);

// Move Email to Trash
router.put('/trash/:id', verifyToken, moveToTrash);

// Recover Email from Trash
router.put('/recover/:id', verifyToken, recoverEmail);

// Fetch Trash Emails
router.get('/trash', verifyToken, getTrashEmails);

// Create Folder
router.post('/folders', verifyToken, createFolder);

// Rename Folder
router.put('/folders/:id', verifyToken, renameFolder);

// Delete Folder
router.delete('/folders/:id', verifyToken, deleteFolder);

// Move Email to Folder
router.put('/move/:emailId/folder/:folderId', verifyToken, moveEmailToFolder);

// Reply to Email
router.post('/reply/:id', verifyToken, replyEmail);

// Reply All to Email
router.post('/reply-all/:id', verifyToken, replyAllEmail);

module.exports = router;
