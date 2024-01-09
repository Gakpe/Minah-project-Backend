const express = require("express");
const router = express.Router();
const accountService = require("../services/accountService");

router.post("/vault/accounts", async (req, res) => {
  try {
    const { name, hiddenOnUI, customerRefId, autoFuel } = req.body;

    const insertedAccount = await accountService.createAccount(name, hiddenOnUI, customerRefId, autoFuel);

    res.status(201).json(insertedAccount);
  } catch (error) {
    if (error.message === "Invalid data format") {
      return res.status(400).json({ error: "Invalid data format" });
    } else {
      console.error("Error creating account:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = router;
