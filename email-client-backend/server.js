require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Error handling for JSON parsing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON');
        return res.status(400).json({ message: 'Invalid JSON' });
    }
    next();
});

// Use the userRoutes
app.use('/api/users', userRoutes);

// Use the emailRoutes
app.use('/api/emails', emailRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Email Client API');
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
