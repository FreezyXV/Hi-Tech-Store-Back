const express = require("express");
const router = express.Router();
const { getSpecifications } = require("../controllers/specController");

// Route to get specifications by variant ID
router.get("/", getSpecifications);

module.exports = router;
