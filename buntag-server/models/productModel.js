const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: {
        type: String, required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number, required: true
    },
    stock: {
        type: Number, default: 0
    },
    image: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true
    },
    isActive: {
        type: Boolean, default: true
    }
}, {
    timestamps: true
});

productSchema.index({
    productName: 1
});

productSchema.index({
    category: 1
});

module.exports = mongoose.model("Product", productSchema);