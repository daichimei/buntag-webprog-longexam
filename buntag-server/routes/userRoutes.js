const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, checkRole, selfOrAdmin } = require("../middleware/authMiddleware");

// Public
router.post("/login", userController.loginUser);
router.post("/", userController.createUser); // registration

// Admin only — the "Users" tab in the dashboard (full list, delete)
router.get("/", verifyToken, checkRole("admin"), userController.getAllUsers);
router.delete("/:id", verifyToken, checkRole("admin"), userController.deleteUser);

// Self or Admin — profile view/edit (a user can see/update their own record;
// an admin can see/update anyone's, e.g. from the Users management page)
router.get("/:id", verifyToken, selfOrAdmin, userController.getUserById);
router.put("/:id", verifyToken, selfOrAdmin, userController.updateUser);

module.exports = router;