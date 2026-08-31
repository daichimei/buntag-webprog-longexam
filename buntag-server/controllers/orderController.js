const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const { HttpStatus } = require("../config/constants");

// Supplier Admin — view every order
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "-password")
            .populate("products.product")
            .sort({ createdAt: -1 });

        res.status(HttpStatus.OK).json(orders);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Customers view only their own order history
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("products.product")
            .sort({ createdAt: -1 });

        res.status(HttpStatus.OK).json(orders);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "-password")
            .populate("products.product");

        if (!order) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
        }

        // A customer may only view their own order and supplier/admin may view any
        const isOwner = order.user._id.toString() === req.user.id;
        if (req.user.role === "customer" && !isOwner) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: "You can only view your own orders" });
        }

        res.status(HttpStatus.OK).json(order);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Your cart is empty" });
        }

        const products = cart.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
        }));

        const totalAmount = cart.items.reduce(
            (sum, item) => sum + (item.product?.price || 0) * item.quantity,
            0
        );

        const newOrder = await Order.create({
            user: req.user.id,
            products,
            totalAmount,
            status: "Pending",
        });

        //clear the cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(HttpStatus.CREATED).json(newOrder);
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
};

// Supplier/Admin can move an order through Pending, Confirmed, Ready for Claiming, Completed, or Cancelled
exports.updateOrderStatus = async (req, res) => {
    try {
        const allowedStatuses = ["Pending", "Confirmed", "Ready for Claiming", "Completed", "Cancelled"];
        if (!allowedStatuses.includes(req.body.status)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid status value" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
        }

        res.status(HttpStatus.OK).json(updatedOrder);
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
};

// Customer — cancel their own order, only while it's still Pending
exports.cancelMyOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
        }
        if (order.user.toString() !== req.user.id) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: "You can only cancel your own orders" });
        }
        if (order.status !== "Pending") {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Only pending orders can be cancelled" });
        }

        order.status = "Cancelled";
        await order.save();

        res.status(HttpStatus.OK).json(order);
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
};

// Admin only — hard delete (cleanup / testing)
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
        }
        res.status(HttpStatus.OK).json({ message: "Order deleted" });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
