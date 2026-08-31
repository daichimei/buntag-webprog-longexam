const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Everything here requires login — an order always belongs to someone
router.use(verifyToken);

// Customer — checkout, own order history, cancel own pending order
router.post("/", checkRole("customer"), orderController.createOrder);
router.get("/my", checkRole("customer"), orderController.getMyOrders);
router.put("/:id/cancel", checkRole("customer"), orderController.cancelMyOrder);

// Supplier/Admin — full order management (the dashboard Orders page)
router.get("/", checkRole("admin", "supplier"), orderController.getAllOrders);
router.put("/:id/status", checkRole("admin", "supplier"), orderController.updateOrderStatus);
router.delete("/:id", checkRole("admin"), orderController.deleteOrder);

// Any logged-in role may view a single order, ownership is checked inside the controller
router.get("/:id", orderController.getOrderById);

module.exports = router;
