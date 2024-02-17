const express = require("express");
const router = express.Router();

// GET home page
/* router.get("/", (req, res) => {
  res.status(200).send("Server is healthy");
});
 */

const MAGIC_PUBLISHABLE_KEY = process.env.MAGIC_PUBLIC;

router.get("/", (req, res) => {
  res.render("index", { title: "Magic Apple Store 🍎", MAGIC_PUBLISHABLE_KEY });
});
module.exports = router;
