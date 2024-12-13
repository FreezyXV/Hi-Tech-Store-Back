const express = require("express");
const router = express.Router();
const { searchModels } = require("../controllers/searchController");

// Route for searching products by keyword
router.get("/", searchModels);

module.exports = router;
