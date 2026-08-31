const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, ref: "Product"
        },
        quantity: {
            type: Number, default: 1
        }
    }],
    totalAmount: {
        type: Number, required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Ready for Claiming", "Completed", "Cancelled"],
        default: "Pending"
    },
    orderDate: {
        type: Date, default: Date.now
    }
}, {
    timestamps: true
});

orderSchema.index({
    user: 1
});

module.exports = mongoose.model("Order", orderSchema);