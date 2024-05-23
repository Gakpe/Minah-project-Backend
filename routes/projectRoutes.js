const express = require("express");
const path = require("path");
const fs = require("fs");
const passport = require('../middleware/authMiddleware');
const projectModel = require("../models/projectModel");
const { getProjects } = require("../services/projectService");
const userModel = require("../models/userModel")
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await userModel.find({}, { issuer: 1, amountInvested: 1 });

    const projects = await getProjects();

    for (const project of projects.projects) {
      const totalAmountInvested = users.reduce((total, user) => {
        const investmentTotal = user.amountInvested.reduce(
          (sum, investment) => sum + +investment.amount,
          0
        );
        return total + +investmentTotal;
      }, 0);

      await projectModel.findByIdAndUpdate(project._id, {
        $set: { totalAmountInvested },
      });
    }

    const updatedProjects = await getProjects();

    return res.status(updatedProjects.statusCode).json({
      message: updatedProjects.message,
      projects: updatedProjects.projects,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/investAmount/:issuer", passport.authenticate('magic'), async (req, res) => {
  if (req.user) {
    const { body } = req;
    let userData = await userModel.findOne({ issuer: req.user.issuer });
    let amountInvest = body.investAmount;
    if (!userData) {
      return res.status(401).json({ message: 'User does not exist.' });
    }
      userData = await userModel.findOneAndUpdate(
        { issuer: req.user.issuer },
        { $set: { amountInvested: [ ...userData.amountInvested || [], {amount: amountInvest, timestamp: new Date()} ]} },
        { new: true }
      );
    console.log("userData = ", userData);
    return res.status(200).json({ message: 'User is logged in', user: req.user, userData: userData });
  } else {
    return res.status(401).end('Could not log the user in.');
  }
});


router.get("/get-image", (req, res) => {
	// Extract filename and filetype from query parameters
	const { filename, filetype } = req.query;

	// Construct the file path. Adjust the directory as per your file organization
	const directoryPath = path.join(__dirname, "..", "uploads/images");
	console.log(directoryPath);
	const filePath = path.join(directoryPath, `${filename}.${filetype}`);
	console.log(filePath);
	// Check if file exists
	fs.access(filePath, fs.constants.F_OK, (err) => {
		if (err) {
			console.log(`${filePath} does not exist`);
			return res.status(404).send("File not found");
		}

		// Set the content type based on file type
		let contentType = "image/jpeg"; // Default content type
		switch (filetype) {
			case "png":
				contentType = "image/png";
				break;
			case "gif":
				contentType = "image/gif";
				break;
			case "jpg":
				contentType = "image/jpeg";
				break;
			case "webp": // Add this case for webp files
				contentType = "image/webp";
				break;
			// Add more cases as needed
		}
		res.setHeader("Content-Type", contentType);

		// Serve the file
		res.sendFile(filePath);
	});
});

module.exports = router;
