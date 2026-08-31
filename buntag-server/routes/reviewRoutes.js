const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Supplier/Admin only — moderation dashboard (all reviews, not scoped to one product)
router.get("/", verifyToken, checkRole("admin", "supplier"), reviewController.getAllReviews);

// Public — guests and all logged-in roles can view reviews on a product
router.get("/product/:productId", reviewController.getReviewsByProduct);

// Customer only — write a review
router.post("/", verifyToken, checkRole("customer"), reviewController.createReview);

// Author, or supplier/admin (moderation) — ownership is checked inside the controller
router.put("/:id", verifyToken, reviewController.updateReview);
router.delete("/:id", verifyToken, reviewController.deleteReview);

module.exports = router;
