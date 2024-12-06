const express = require('express');
const {
    sendEmail, getInboxEmails, getSentEmails, markEmailAsRead, moveToTrash, recoverEmail, getTrashEmails, createFolder, renameFolder, deleteFolder, moveEmailToFolder, replyEmail, replyAllEmail
} = require('../controllers/emailController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Email routes
router.use(verifyToken);
router.post('/send', sendEmail);
router.get('/inbox', getInboxEmails);
router.get('/sent', getSentEmails);
router.put('/read/:id', markEmailAsRead);
router.put('/trash/:id', moveToTrash);
router.put('/recover/:id', recoverEmail);
router.get('/trash', getTrashEmails);
router.put('/move/:emailId/folder/:folderId', moveEmailToFolder);
router.post('/reply/:id', replyEmail);
router.post('/reply-all/:id', replyAllEmail);

// Folder routes
router.post('/folders', createFolder);
router.put('/folders/:id', renameFolder);
router.delete('/folders/:id', deleteFolder);

module.exports = router;
