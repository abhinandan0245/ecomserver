// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// POST: Submit message
router.post("/", contactController.createMessage);

// GET: Fetch all messages (admin panel usage)
router.get("/", contactController.getMessages);

// DELETE: Remove message
router.delete("/:id", contactController.deleteMessage);

module.exports = router;
