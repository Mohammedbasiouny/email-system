const pool = require('../config/dbConfig');
require('dotenv').config();

const sendEmail = async (senderId, receiverIds, cc, subject, body, draftId = null) => {
    try {
        if (draftId) {
            // Update the draft to mark it as sent
            await pool.query(
                'UPDATE emails SET is_draft = FALSE, receiver_id = $1, cc = $2, subject = $3, body = $4 WHERE id = $5',
                [receiverIds.join(','), cc, subject, body, draftId]
            );
        } else {
            // Handle primary recipients (receiverIds)
            for (const receiverId of receiverIds) {
                // Insert the email into the emails table
                const result = await pool.query(
                    'INSERT INTO emails (sender_id, receiver_id, cc, subject, body) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                    [senderId, receiverId, cc, subject, body]
                );
                const emailId = result.rows[0].id;

                // Get the folder IDs for Sent and Inbox
                const sentFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [senderId, 'Sent']);
                const inboxFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [receiverId, 'Inbox']);

                // Associate the email with the Sent folder for the sender
                await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, sentFolder.rows[0].id]);

                // Associate the email with the Inbox folder for the receiver
                await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, inboxFolder.rows[0].id]);
            }

            // Handle CC recipients
            if (cc) {
                const ccRecipients = cc.split(',').map(email => email.trim());
                for (const ccRecipient of ccRecipients) {
                    // Get the user ID for the CC recipient
                    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [ccRecipient]);
                    if (userResult.rows.length === 0) {
                        throw new Error(`User with email ${ccRecipient} not found`);
                    }
                    const ccUserId = userResult.rows[0].id;

                    // Insert the email into the emails table
                    const result = await pool.query(
                        'INSERT INTO emails (sender_id, receiver_id, cc, subject, body) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                        [senderId, ccUserId, cc, subject, body]
                    );
                    const emailId = result.rows[0].id;

                    // Get the folder IDs for Sent and Inbox
                    const sentFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [senderId, 'Sent']);
                    const inboxFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [ccUserId, 'Inbox']);

                    // Associate the email with the Sent folder for the sender
                    await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, sentFolder.rows[0].id]);

                    // Associate the email with the Inbox folder for the CC recipient
                    await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, inboxFolder.rows[0].id]);
                }
            }
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const saveDraft = async (senderId, receiverIds, cc, subject, body) => {
    try {
        const result = await pool.query(
            'INSERT INTO emails (sender_id, receiver_id, cc, subject, body, is_draft) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING id',
            [senderId, receiverIds.join(','), cc, subject, body]
        );
        return result.rows[0].id;
    } catch (error) {
        console.error('Error saving draft:', error);
        throw error;
    }
};

const getInboxEmails = async (receiverId) => {
    const inboxFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [receiverId, 'Inbox']);
    const result = await pool.query(
        'SELECT e.* FROM emails e JOIN email_folders ef ON e.id = ef.email_id WHERE ef.folder_id = $1 AND e.receiver_id = $2 AND e.deleted_at IS NULL ORDER BY e.created_at DESC',
        [inboxFolder.rows[0].id, receiverId]
    );
    return result.rows;
};

const getSentEmails = async (senderId) => {
    const sentFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [senderId, 'Sent']);
    const result = await pool.query(
        'SELECT e.* FROM emails e JOIN email_folders ef ON e.id = ef.email_id WHERE ef.folder_id = $1 AND e.sender_id = $2 AND e.deleted_at IS NULL ORDER BY e.created_at DESC',
        [sentFolder.rows[0].id, senderId]
    );
    return result.rows;
};

const markEmailAsRead = async (emailId, receiverId) => {
    await pool.query('UPDATE emails SET is_read = TRUE WHERE id = $1 AND receiver_id = $2', [
        emailId,
        receiverId,
    ]);
};

const moveToTrash = async (emailId, userId) => {
    const trashFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [userId, 'Recent Delete']);
    await pool.query('UPDATE emails SET deleted_at = NOW() WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)', [
        emailId,
        userId,
    ]);

    // Check if the email is already associated with the Trash folder
    const existingAssociation = await pool.query(
        'SELECT * FROM email_folders WHERE email_id = $1 AND folder_id = $2',
        [emailId, trashFolder.rows[0].id]
    );

    if (existingAssociation.rows.length === 0) {
        await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, trashFolder.rows[0].id]);
    }
};

const recoverEmail = async (emailId, userId) => {
    const inboxFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [userId, 'Inbox']);
    await pool.query('UPDATE emails SET deleted_at = NULL WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)', [
        emailId,
        userId,
    ]);

    // Check if the email is already associated with the Inbox folder
    const existingAssociation = await pool.query(
        'SELECT * FROM email_folders WHERE email_id = $1 AND folder_id = $2',
        [emailId, inboxFolder.rows[0].id]
    );

    if (existingAssociation.rows.length === 0) {
        await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, inboxFolder.rows[0].id]);
    }
};

const getTrashEmails = async (userId) => {
    const trashFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [userId, 'Recent Delete']);
    const result = await pool.query(
        'SELECT e.* FROM emails e JOIN email_folders ef ON e.id = ef.email_id WHERE ef.folder_id = $1 AND (e.sender_id = $2 OR e.receiver_id = $2) AND e.deleted_at IS NOT NULL ORDER BY e.created_at DESC',
        [trashFolder.rows[0].id, userId]
    );
    return result.rows;
};

const createFolder = async (userId, name) => {
    try {
        const folderExists = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [userId, name]);
        if (folderExists.rows.length > 0) {
            throw new Error('Folder already exists');
        }
        await pool.query('INSERT INTO folders (user_id, name) VALUES ($1, $2)', [userId, name]);
    } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
    }
};

const renameFolder = async (folderId, userId, newName) => {
    try {
        const folder = await pool.query('SELECT id FROM folders WHERE id = $1 AND user_id = $2', [folderId, userId]);
        if (folder.rows.length === 0) {
            throw new Error('Folder not found');
        }
        await pool.query('UPDATE folders SET name = $1 WHERE id = $2 AND user_id = $3', [newName, folderId, userId]);
    } catch (error) {
        console.error('Error renaming folder:', error);
        throw error;
    }
};

const deleteFolder = async (folderId, userId) => {
    try {
        const folder = await pool.query('SELECT id FROM folders WHERE id = $1 AND user_id = $2', [folderId, userId]);
        if (folder.rows.length === 0) {
            throw new Error('Folder not found');
        }
        await pool.query('DELETE FROM folders WHERE id = $1 AND user_id = $2', [folderId, userId]);
    } catch (error) {
        console.error('Error deleting folder:', error);
        throw error;
    }
};

const moveEmailToFolder = async (emailId, userId, folderId) => {
    await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, folderId]);
};

const replyEmail = async (originalEmailId, senderId, body) => {
    const originalEmail = await pool.query('SELECT * FROM emails WHERE id = $1', [originalEmailId]);
    const receiverId = originalEmail.rows[0].sender_id;
    const subject = `Re: ${originalEmail.rows[0].subject}`;
    const cc = originalEmail.rows[0].cc;

    // Insert the reply email into the emails table
    const result = await pool.query(
        'INSERT INTO emails (sender_id, receiver_id, cc, subject, body) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [senderId, receiverId, cc, subject, body]
    );
    const emailId = result.rows[0].id;

    // Get the folder IDs for Sent and Inbox
    const sentFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [senderId, 'Sent']);
    const inboxFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [receiverId, 'Inbox']);

    // Associate the reply email with the Sent folder for the sender
    await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, sentFolder.rows[0].id]);

    // Associate the reply email with the Inbox folder for the receiver
    await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, inboxFolder.rows[0].id]);
};

const replyAllEmail = async (originalEmailId, senderId, body) => {
    // Fetch the original email
    const originalEmail = await pool.query('SELECT * FROM emails WHERE id = $1', [originalEmailId]);
    const receiverId = originalEmail.rows[0].sender_id;
    const subject = `Re: ${originalEmail.rows[0].subject}`;
    const cc = originalEmail.rows[0].cc;

    // Insert the reply email into the emails table
    const result = await pool.query(
        'INSERT INTO emails (sender_id, receiver_id, cc, subject, body) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [senderId, receiverId, cc, subject, body]
    );
    const emailId = result.rows[0].id;

    // Get the folder IDs for Sent and Inbox
    const sentFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [senderId, 'Sent']);
    const inboxFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [receiverId, 'Inbox']);

    // Associate the reply email with the Sent folder for the sender
    await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, sentFolder.rows[0].id]);

    // Associate the reply email with the Inbox folder for the receiver
    await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, inboxFolder.rows[0].id]);

    // Send reply to all CC recipients
    if (cc) {
        const ccRecipients = cc.split(',');
        for (const ccRecipient of ccRecipients) {
            const ccUser = await pool.query('SELECT id FROM users WHERE email = $1', [ccRecipient.trim()]);
            if (ccUser.rows.length > 0) {
                const ccUserId = ccUser.rows[0].id;
                const ccInboxFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [ccUserId, 'Inbox']);

                await pool.query(
                    'INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)',
                    [emailId, ccInboxFolder.rows[0].id]
                );
            }
        }
    }

    // Send reply to all To recipients (excluding the original sender)
    const toRecipients = await pool.query('SELECT id FROM users WHERE id != $1 AND id IN (SELECT receiver_id FROM emails WHERE id = $2)', [senderId, originalEmailId]);
    for (const toRecipient of toRecipients.rows) {
        const toInboxFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [toRecipient.id, 'Inbox']);
        await pool.query(
            'INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)',
            [emailId, toInboxFolder.rows[0].id]
        );
    }
};

const forwardEmail = async (originalEmailId, senderId, receiverIds, body) => {
    const originalEmail = await pool.query('SELECT * FROM emails WHERE id = $1', [originalEmailId]);
    const subject = `Fwd: ${originalEmail.rows[0].subject}`;
    const originalBody = originalEmail.rows[0].body;

    for (const receiverId of receiverIds) {
        // Insert the forwarded email into the emails table
        const result = await pool.query(
            'INSERT INTO emails (sender_id, receiver_id, cc, subject, body) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [senderId, receiverId, originalEmail.rows[0].cc, subject, `${body}\n\n--- Forwarded message ---\n\n${originalBody}`]
        );
        const emailId = result.rows[0].id;

        // Get the folder IDs for Sent and Inbox
        const sentFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [senderId, 'Sent']);
        const inboxFolder = await pool.query('SELECT id FROM folders WHERE user_id = $1 AND name = $2', [receiverId, 'Inbox']);

        // Associate the forwarded email with the Sent folder for the sender
        await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, sentFolder.rows[0].id]);

        // Associate the forwarded email with the Inbox folder for the receiver
        await pool.query('INSERT INTO email_folders (email_id, folder_id) VALUES ($1, $2)', [emailId, inboxFolder.rows[0].id]);
    }
};

const markEmailAsUnread = async (emailId, receiverId) => {
    await pool.query('UPDATE emails SET is_read = FALSE WHERE id = $1 AND receiver_id = $2', [
        emailId,
        receiverId,
    ]);
};

const flagEmailAsImportant = async (emailId, userId) => {
    await pool.query('UPDATE emails SET is_important = TRUE WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)', [
        emailId,
        userId,
    ]);
};

module.exports = {
    sendEmail,
    getInboxEmails,
    getSentEmails,
    markEmailAsRead,
    moveToTrash,
    recoverEmail,
    getTrashEmails,
    createFolder,
    renameFolder,
    deleteFolder,
    moveEmailToFolder,
    replyEmail,
    replyAllEmail,
    forwardEmail,
    markEmailAsUnread,
    flagEmailAsImportant,
    saveDraft,
};