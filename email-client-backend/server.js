require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const port = process.env.PORT || 5000;

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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/emails', emailRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Email Client API');
});

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
