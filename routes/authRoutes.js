const express = require('express');
const passport = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', passport.authenticate('magic'), (req, res) => {
    if (req.user) {
        res.status(200).end('User is logged in.');
    } else {
        return res.status(401).end('Could not log the user in.');
    }
});

// ... (your existing code for session behavior)

router.get('/', async (req, res) => {
    // ... (your existing code for the user endpoint)
});

router.post('/buy-apple', async (req, res) => {
    // ... (your existing code for buying an apple)
});

router.post('/logout', async (req, res) => {
    // ... (your existing code for logout)
});

module.exports = router;
