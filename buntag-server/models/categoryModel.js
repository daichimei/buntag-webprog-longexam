const mongoose = require("mongoose");

// NU Bulldogs Exchange only sells merchandise under these 3 fixed categories.
const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
        enum: ["Daily Essentials", "Study Supplies", "Campus Apparel"]
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Category", categorySchema);