const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { HttpStatus } = require("../config/constants");

// Recalculates totalPrice from the current items (after populating product prices)
const recalcTotal = async (cart) => {
    await cart.populate("items.product");
    cart.totalPrice = cart.items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        return sum + price * item.quantity;
    }, 0);
};

// GET the logged-in user's own cart (creates an empty one if none exists yet)
exports.getMyCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [], totalPrice: 0 });
        }
        res.status(HttpStatus.OK).json(cart);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Add an item to the logged-in user's cart, or increment quantity if already present
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        if (!productId) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "productId is required" });
        }

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await recalcTotal(cart);
        await cart.save();

        res.status(HttpStatus.CREATED).json(cart);
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
};

// Set a specific item's quantity. Quantity of 0 (or less) removes the item.
exports.updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Cart not found" });
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        } else {
            const item = cart.items.find((item) => item.product.toString() === productId);
            if (!item) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "Item not in cart" });
            }
            item.quantity = quantity;
        }

        await recalcTotal(cart);
        await cart.save();

        res.status(HttpStatus.OK).json(cart);
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
};

// Remove a single item entirely, regardless of quantity
exports.removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);

        await recalcTotal(cart);
        await cart.save();

        res.status(HttpStatus.OK).json(cart);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Clear the whole cart (e.g. after checkout)
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(HttpStatus.OK).json({ message: "Cart already empty" });
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(HttpStatus.OK).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
