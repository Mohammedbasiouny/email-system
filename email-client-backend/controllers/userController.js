const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/dbConfig'); // Import pool
const { getUserByEmail, createUser, getUserById, updateUser, updateUserPassword, deleteUser } = require('../models/userModel');

const signup = async (req, res) => {
    const { firstName, secondName, username, password } = req.body;
    const email = `${username}@swar.com`;

    try {
        const userExists = await getUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await createUser(firstName, secondName, username, email, hashedPassword);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, role: user.role }); // Include the user's role in the response
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await pool.query('SELECT id, first_name, second_name, username, email, role FROM users WHERE deleted_at IS NULL');
        res.status(200).json(users.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { firstName, secondName, role, password } = req.body;

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedFirstName = firstName || user.first_name;
        const updatedSecondName = secondName || user.second_name;
        const updatedRole = role || user.role;

        await updateUser(id, updatedFirstName, updatedSecondName, user.username, user.email, updatedRole);

        if (password) {
            const updatedPasswordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
            await updateUserPassword(id, updatedPasswordHash);
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserName = async (req, res) => {
    const { id } = req.params;
    const { firstName, secondName } = req.body;

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedFirstName = firstName || user.first_name;
        const updatedSecondName = secondName || user.second_name;

        await updateUser(id, updatedFirstName, updatedSecondName, user.username, user.email, user.role);

        res.status(200).json({ message: 'User name updated successfully' });
    } catch (error) {
        console.error('Error updating user name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedRole = role || user.role;

        await updateUser(id, user.first_name, user.second_name, user.username, user.email, updatedRole);

        res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserPasswordController = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await updateUserPassword(id, hashedPassword);

        res.status(200).json({ message: 'User password updated successfully' });
    } catch (error) {
        console.error('Error updating user password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUserController = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await deleteUser(id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    const { firstName, secondName, password } = req.body;

    try {
        const user = await getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedFirstName = firstName || user.first_name;
        const updatedSecondName = secondName || user.second_name;

        await updateUser(req.user.id, updatedFirstName, updatedSecondName, user.username, user.email, user.role);

        if (password) {
            const updatedPasswordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
            await updateUserPassword(req.user.id, updatedPasswordHash);
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getProfile = async (req, res) => {
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
};


module.exports = {
    signup,
    login,
    getUsers,
    updateUserDetails,
    updateUserName,
    updateUserRole,
    updateUserPassword: updateUserPasswordController,
    deleteUser: deleteUserController,
    updateProfile,
    getProfile,
};