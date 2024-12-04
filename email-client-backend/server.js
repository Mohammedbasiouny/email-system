const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// User routes
app.use('/api/users', userRoutes);

// Email routes
app.use('/api/emails', emailRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Email Client API');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
