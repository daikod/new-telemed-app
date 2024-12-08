const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const db = require('../config/db');
const sendEmail = require('../utils/email');

router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, phone } = req.body;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const userId = uuidv4();
        await db.query(
            'INSERT INTO users (id, email, password, first_name, last_name, role, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, email, hashedPassword, firstName, lastName, role, phone]
        );

        // Send verification email
        const verificationToken = jwt.sign({ userId }, config.jwt.secret, { expiresIn: '24h' });
        await sendEmail(email, 'Email Verification', `Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/verify/${verificationToken}`);

        res.status(201).json({ message: 'Registration successful. Please check your email for verification.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Get user
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.email_verified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 