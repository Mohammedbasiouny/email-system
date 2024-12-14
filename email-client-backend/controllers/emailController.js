const { sendEmail, getInboxEmails, getSentEmails, markEmailAsRead, moveToTrash, recoverEmail, getTrashEmails, createFolder, renameFolder, deleteFolder, moveEmailToFolder, replyEmail, replyAllEmail, forwardEmail, markEmailAsUnread, flagEmailAsImportant, saveDraft } = require('../models/emailModel');

const sendEmailController = async (req, res) => {
    const { receiverIds, subject, body, cc, draftId } = req.body;

    try {
        await sendEmail(req.user.id, receiverIds, cc, subject, body, draftId);
        res.status(201).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch Inbox Emails
const getInboxEmailsController = async (req, res) => {
    try {
        const inbox = await getInboxEmails(req.user.id);
        res.status(200).json(inbox);
    } catch (error) {
        console.error('Error fetching inbox emails:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch Sent Emails
const getSentEmailsController = async (req, res) => {
    try {
        const sent = await getSentEmails(req.user.id);
        res.status(200).json(sent);
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Mark Email as Read
const markEmailAsReadController = async (req, res) => {
    const emailId = req.params.id;

    try {
        await markEmailAsRead(emailId, req.user.id);
        res.status(200).json({ message: 'Email marked as read' });
    } catch (error) {
        console.error('Error marking email as read:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Move Email to Trash
const moveToTrashController = async (req, res) => {
    const emailId = req.params.id;

    try {
        await moveToTrash(emailId, req.user.id);
        res.status(200).json({ message: 'Email moved to trash' });
    } catch (error) {
        console.error('Error moving email to trash:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Recover Email from Trash
const recoverEmailController = async (req, res) => {
    const emailId = req.params.id;

    try {
        await recoverEmail(emailId, req.user.id);
        res.status(200).json({ message: 'Email recovered from trash' });
    } catch (error) {
        console.error('Error recovering email from trash:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch Trash Emails
const getTrashEmailsController = async (req, res) => {
    try {
        const trash = await getTrashEmails(req.user.id);
        res.status(200).json(trash);
    } catch (error) {
        console.error('Error fetching trash emails:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create Folder
const createFolderController = async (req, res) => {
    const { name } = req.body;

    try {
        await createFolder(req.user.id, name);
        res.status(201).json({ message: 'Folder created successfully' });
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Rename Folder
const renameFolderController = async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    try {
        await renameFolder(id, req.user.id, newName);
        res.status(200).json({ message: 'Folder renamed successfully' });
    } catch (error) {
        console.error('Error renaming folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete Folder
const deleteFolderController = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteFolder(id, req.user.id);
        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Move Email to Folder
const moveEmailToFolderController = async (req, res) => {
    const { emailId, folderId } = req.params;

    try {
        await moveEmailToFolder(emailId, req.user.id, folderId);
        res.status(200).json({ message: 'Email moved to folder successfully' });
    } catch (error) {
        console.error('Error moving email to folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reply to Email
const replyEmailController = async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;

    try {
        await replyEmail(id, req.user.id, body);
        res.status(201).json({ message: 'Reply sent successfully' });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reply All to Email
const replyAllEmailController = async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;

    try {
        await replyAllEmail(id, req.user.id, body);
        res.status(201).json({ message: 'Reply All sent successfully' });
    } catch (error) {
        console.error('Error sending reply all:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Forward Email
const forwardEmailController = async (req, res) => {
    const { id } = req.params;
    const { receiverIds, body } = req.body;

    try {
        await forwardEmail(id, req.user.id, receiverIds, body);
        res.status(201).json({ message: 'Email forwarded successfully' });
    } catch (error) {
        console.error('Error forwarding email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Mark Email as Unread
const markEmailAsUnreadController = async (req, res) => {
    const emailId = req.params.id;

    try {
        await markEmailAsUnread(emailId, req.user.id);
        res.status(200).json({ message: 'Email marked as unread' });
    } catch (error) {
        console.error('Error marking email as unread:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Flag Email as Important
const flagEmailAsImportantController = async (req, res) => {
    const emailId = req.params.id;

    try {
        await flagEmailAsImportant(emailId, req.user.id);
        res.status(200).json({ message: 'Email flagged as important' });
    } catch (error) {
        console.error('Error flagging email as important:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Save Draft
const saveDraftController = async (req, res) => {
    const { receiverIds, subject, body, cc } = req.body;

    try {
        const draftId = await saveDraft(req.user.id, receiverIds, cc, subject, body);
        res.status(201).json({ message: 'Draft saved successfully', draftId });
    } catch (error) {
        console.error('Error saving draft:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    sendEmail: sendEmailController,
    getInboxEmails: getInboxEmailsController,
    getSentEmails: getSentEmailsController,
    markEmailAsRead: markEmailAsReadController,
    moveToTrash: moveToTrashController,
    recoverEmail: recoverEmailController,
    getTrashEmails: getTrashEmailsController,
    createFolder: createFolderController,
    renameFolder: renameFolderController,
    deleteFolder: deleteFolderController,
    moveEmailToFolder: moveEmailToFolderController,
    replyEmail: replyEmailController,
    replyAllEmail: replyAllEmailController,
    forwardEmail: forwardEmailController,
    markEmailAsUnread: markEmailAsUnreadController,
    flagEmailAsImportant: flagEmailAsImportantController,
    saveDraft: saveDraftController,
};