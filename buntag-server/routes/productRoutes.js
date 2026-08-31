const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Public — anyone (including guests, if you don't gate this route at all) can browse
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Supplier + Admin only — this is the "CRUD products" part of the dashboard
router.post("/", verifyToken, checkRole("admin", "supplier"), productController.createProduct);
router.put("/:id", verifyToken, checkRole("admin", "supplier"), productController.updateProduct);
router.delete("/:id", verifyToken, checkRole("admin", "supplier"), productController.deleteProduct);

module.exports = router;