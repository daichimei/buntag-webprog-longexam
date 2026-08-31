const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Cart only makes sense for a logged-in customer's own account.
// Every route below reads the user from the JWT (req.user.id), never a URL param,
// so nobody can view or edit another user's cart by guessing an id.
router.use(verifyToken, checkRole("customer"));

router.get("/", cartController.getMyCart);
router.post("/", cartController.addToCart);
router.put("/item/:productId", cartController.updateCartItem);
router.delete("/item/:productId", cartController.removeCartItem);
router.delete("/", cartController.clearCart);

module.exports = router;
