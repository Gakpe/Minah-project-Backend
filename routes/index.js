const express = require("express");
const router = express.Router();


// GET home page
router.get("/", (req, res) => {
  res.status(200).send("Server is healthy");
});

module.exports = router;
