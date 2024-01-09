const express = require('express');
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

module.exports = router;