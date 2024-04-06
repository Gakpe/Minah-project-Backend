const express = require('express');
const path = require('path');
const fs = require('fs');
const projectModel = require("../models/projectModel");
const {getProjects} = require("../services/projectService");
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const result = await getProjects();
    return res.status(result.statusCode).json({ message: result.message, projects: result.projects });
  } catch (error) {
    console.log("Error: ", error);
    return  res.status(500).json({ message: "Internal Server Error"});
  }
});
router.get('/get-image', (req, res) => {
  // Extract filename and filetype from query parameters
  const { filename, filetype } = req.query;

  // Construct the file path. Adjust the directory as per your file organization
  const directoryPath = path.join(__dirname, '..', 'uploads/images');
  console.log(directoryPath) 
  const filePath = path.join(directoryPath, `${filename}.${filetype}`);
  console.log(filePath)
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
  
      if (err) {
          console.log(`${filePath} does not exist`);
          return res.status(404).send('File not found');
      }

      // Set the content type based on file type
      let contentType = 'image/jpeg'; // Default content type
      switch (filetype) {
          case 'png':
              contentType = 'image/png';
              break;
          case 'gif':
              contentType = 'image/gif';
              break;
          case 'jpg':
              contentType = 'image/jpeg';
              break;
          case 'webp': // Add this case for webp files
              contentType = 'image/webp';
              break;
          // Add more cases as needed
      }
      res.setHeader('Content-Type', contentType);

      // Serve the file
      res.sendFile(filePath);
  });
});

module.exports = router;