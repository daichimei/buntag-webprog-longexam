// Run once: node seedUsers.js
// Seeds sample supplier and customer accounts with properly hashed passwords.
// If you manually added users through Compass before, their passwords are
// plaintext and will NEVER log in successfully — bcrypt.compare() only works
// against a real bcrypt hash, not plain text. Delete those manual entries in
// Compass first, then run this script instead.

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");

const USERS = [
    {
        name: "Bulldogs Supply Co.",
        email: "supplier1@nu.edu.ph",
        password: "Supplier123!",
        address: "NU Manila, Sampaloc",
        role: "supplier",
    },
    {
        name: "Campus Gear PH",
        email: "supplier2@nu.edu.ph",
        password: "Supplier123!",
        address: "NU Manila, Sampaloc",
        role: "supplier",
    },
    {
        name: "Juan Dela Cruz",
        email: "customer1@nu.edu.ph",
        password: "Customer123!",
        address: "123 Sampaloc St, Manila",
        role: "customer",
    },
    {
        name: "Maria Santos",
        email: "customer2@nu.edu.ph",
        password: "Customer123!",
        address: "456 Espana Blvd, Manila",
        role: "customer",
    },
    {
        name: "Pedro Reyes",
        email: "customer3@nu.edu.ph",
        password: "Customer123!",
        address: "789 Quezon Ave, Manila",
        role: "customer",
    },
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        for (const item of USERS) {
            const existing = await User.findOne({ email: item.email });

            if (existing) {
                // Re-hash in case this account was previously created manually
                // with a plaintext password (e.g. via Compass)
                existing.password = await bcrypt.hash(item.password, 10);
                existing.name = item.name;
                existing.address = item.address;
                existing.role = item.role;
                await existing.save();
                console.log(`Fixed existing account (password re-hashed): ${item.email}`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(item.password, 10);
            await User.create({ ...item, password: hashedPassword });
            console.log(`Created ${item.role}: ${item.email}`);
        }

        console.log("Seeding complete. Login credentials (email / password):");
        USERS.forEach((u) => console.log(`  ${u.email} / ${u.password}`));
        process.exit(0);
    } catch (error) {
        console.error("Failed to seed users:", error.message);
        process.exit(1);
    }
};

run();
