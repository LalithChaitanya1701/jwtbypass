const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Secret key for JWT (not used for verification in this demo for simplicity)
const secretKey = 'weaksecret';

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (frontend)
app.use(express.static('public'));

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simple check (for demo purposes)
    if (username && password) {
        // Generate JWT with role: user
        const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

// Admin endpoint
app.get('/admin', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    try {
        // Decode JWT without verification (vulnerable for demo)
        const decoded = jwt.decode(token);
        if (decoded.role === 'admin') {
            res.json({ message: 'You are admin', dashboard: 'Admin Dashboard' });
        } else {
            res.status(403).json({ message: 'You are not admin' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
