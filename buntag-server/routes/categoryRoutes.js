const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Public — needed for "search by category" on the storefront
router.get("/", categoryController.getAllCategories);

// Admin only — categories are a fixed set (Daily Essentials, Study Supplies, Campus Apparel),
// not something suppliers should be able to add to
router.post("/", verifyToken, checkRole("admin"), categoryController.createCategory);
router.put("/:id", verifyToken, checkRole("admin"), categoryController.updateCategory);
router.delete("/:id", verifyToken, checkRole("admin"), categoryController.deleteCategory);

module.exports = router;