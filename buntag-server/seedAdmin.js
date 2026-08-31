// Run once: node seedAdmin.js
// Fixes (or creates) a single admin account with a properly hashed password.

require("dotenv").config();
console.log("MONGO_URI is:", process.env.MONGO_URI);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");

const ADMIN = {
  name: "System Admin",
  email: "adminbulldogsexchange@gmail.com",
  password: "adminPASS12!",
  address: "N/A",
  role: "admin",
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash(ADMIN.password, 10);
    const existing = await User.findOne({ email: ADMIN.email });

    if (existing) {
      existing.password = hashedPassword;
      existing.role = "admin";
      existing.name = ADMIN.name;
      existing.address = existing.address || ADMIN.address;
      await existing.save();
      console.log("Existing admin account fixed (password re-hashed):", existing.email);
    } else {
      const admin = await User.create({ ...ADMIN, password: hashedPassword });
      console.log("Admin account created:", admin.email);
    }

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
};

run();