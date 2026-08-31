// Load environment variables
require("dotenv").config();

// Imports
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/product", require("./routes/productRoutes"));
app.use("/api/v1/product", require("./routes/productRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
app.use("/api/review", require("./routes/reviewRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("Bulldogs Exchange API Running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("SERVER IS USING MONGO_URI:", process.env.MONGO_URI);
});
