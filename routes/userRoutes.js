const express = require('express');
const passport = require('../middleware/authMiddleware');
const multer = require('multer');
const userModel = require("../models/userModel")
const router = express.Router();
// Multer setup for handling file uploads
const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({ storage: storage });

router.post('/login',passport.authenticate('magic'),  (req, res) => {
  console.log(req,"here here")
    if (req.user) {
        res.status(200).json({ message: 'User is logged in', user: req.user });
    } else {
        return res.status(401).end('Could not log the user in.');
    }
});
// router.get('/passportAuth', passport.authenticate('magic', {
//   successRedirect: '/user/login',
//   failureRedirect: '/user/error',
//   failureFlash: false
// }));

router.get("/get", async (req, res) => {
    if (req.isAuthenticated()) {
      return res.status(200).json(req.user).end();
    } else {
      return res.status(401).end(`User is not logged in.`);
    }
});

router.put('/:issuer', upload.none(), async (req, res) => {
    try {
      const existingUser = await userModel.findOne({ issuer: req.params.issuer });
      
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const formFields = req.body;
      const allowedFields = ['address', 'first_name', 'last_name', 'nationality' ];
      allowedFields.forEach(field => {
        if (formFields[field]) {
          existingUser[field] = formFields[field];
        }
      });
  
      await existingUser.save();
  
      res.status(200).json({ message: 'User updated', user: existingUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// router.put('/update', upload.single('image'), async (req, res) => {
//     //if (!req.user) return res.status(401).end('User not authenticated.');
//     try {
//         // Find the existing user based on the issuer field
//         const existingUser = await userModel.findOne({ issuer: req.body.issuer });

//         if (!existingUser) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         ['address', 'first_name', 'last_name'].forEach(field => {
//             if (req.body[field]) existingUser[field] = req.body[field];
//         });

//         if (req.file) {
//             existingUser.image = {
//                 data: req.file.buffer.toString('base64'),
//                 contentType: req.file.mimetype
//             };
//         }

//         await existingUser.save();
        
//         res.status(200).json({ message: 'User updated', user: existingUser });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Delete route
router.delete('/delete/:issuer', async (req, res) => {
    // Check authentication if needed
    // if (!req.user) return res.status(401).end('User not authenticated.');

    try {
        // Find and delete the user based on the issuer field
        const deletedUser = await userModel.findOneAndDelete({ issuer: req.params.issuer });

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted', user: deletedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
