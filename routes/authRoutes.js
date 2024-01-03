const express = require('express');
const passport = require('../middleware/authMiddleware');
const multer = require('multer');
const userModel = require("../models/userModel")
const router = express.Router();
// Multer setup for handling file uploads
const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({ storage: storage });

router.post('/login', passport.authenticate('magic'), (req, res) => {
    if (req.user) {
        res.status(200).json({ message: 'User is logged in', user: req.user });
    } else {
        return res.status(401).end('Could not log the user in.');
    }
});

router.put('/update', upload.single('image'), async (req, res) => {
    //if (!req.user) return res.status(401).end('User not authenticated.');
    try {
        // Find the existing user based on the issuer field
        const existingUser = await userModel.findOne({ issuer: req.body.issuer });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user information
        ['address', 'first_name', 'last_name'].forEach(field => {
            if (req.body[field]) existingUser[field] = req.body[field];
        });

        // Handle and save image if provided
        if (req.file) {
            // Assuming 'image' is the field name for the file in the request
            // Save the image to your desired location or cloud storage
            // For simplicity, we are storing the image in the user object here
            existingUser.image = {
                data: req.file.buffer.toString('base64'),
                contentType: req.file.mimetype
            };
        }

        // Save the updated user
        await existingUser.save();
        
        res.status(200).json({ message: 'User updated', user: existingUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
