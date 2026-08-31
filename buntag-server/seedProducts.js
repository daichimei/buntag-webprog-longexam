// Run once: node seedProducts.js
// Seeds the 3 fixed categories and a starter set of NU merchandise products.
// Image URLs are intentionally left blank — add real ones later via the
// dashboard's "Image URL" field, or directly in Compass.

require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/categoryModel");
const Product = require("./models/productModel");
const User = require("./models/userModel");

const CATEGORIES = ["Daily Essentials", "Study Supplies", "Campus Apparel"];

const PRODUCTS = [
    // --- Daily Essentials ---
    {
        productName: "NU Bulldogs Tumbler",
        description: "Insulated stainless steel tumbler with the NU Bulldogs logo. Keeps drinks cold for 12 hours, hot for 6.",
        price: 349,
        stock: 40,
        category: "Daily Essentials",
        image: "https://nationsu.edu/wp-content/uploads/2021/05/44519-22.jpg", // TODO: paste a real product photo URL here
    },
    {
        productName: "NU Bulldogs Tote Bag",
        description: "Canvas tote bag, perfect for carrying books and daily essentials around campus.",
        price: 199,
        stock: 60,
        category: "Daily Essentials",
        image: "https://ph-live-01.slatic.net/p/eca5d88df1d99f64637dcac09264da8b.jpg", // TODO: paste a real product photo URL here
    },
    {
        productName: "NU Bulldogs Keychain",
        description: "Metal keychain with the Bulldogs crest — a small everyday campus essential.",
        price: 89,
        stock: 100,
        category: "Daily Essentials",
        image: "https://varsitylifestyleco.com/cdn/shop/files/NU1.jpg?v=1700016451", // TODO: paste a real product photo URL here
    },

    // --- Study Supplies ---
    {
        productName: "NU Bulldogs Notebook Set",
        description: "Set of 3 ruled notebooks with the NU Bulldogs cover design, 80 leaves each.",
        price: 149,
        stock: 80,
        category: "Study Supplies",
        image: "https://ph-test-11.slatic.net/p/a1df064a4c3b21daa0afd6b95c53f57e.jpg", // TODO: paste a real product photo URL here
    },
    {
        productName: "NU Bulldogs Ballpen Pack (5pcs)",
        description: "Pack of 5 blue ballpens featuring the Bulldogs logo along the barrel.",
        price: 75,
        stock: 120,
        category: "Study Supplies",
        image: "https://down-ph.img.susercontent.com/file/ph-11134207-7quky-lj86rv8zcw9odc", // TODO: paste a real product photo URL here
    },
    {
        productName: "NU Bulldogs Clipboard Folder",
        description: "Hard clipboard folder for exams and handouts, printed with the university seal.",
        price: 129,
        stock: 50,
        category: "Study Supplies",
        image: "https://ph-test-11.slatic.net/p/ea0ccd6aafa8995ce774206952fa6232.png", // TODO: paste a real product photo URL here
    },

    // --- Campus Apparel ---
    {
        productName: "NU Bulldogs Varsity Jacket",
        description: "Classic varsity jacket in NU colors, embroidered Bulldogs crest on the chest.",
        price: 1299,
        stock: 25,
        category: "Campus Apparel",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKcvs5uo1Qp67xTTN8OBldnASxbt-vAcJZiNqYCeJCtJmLMdO6r3CxxfI&s=10", // TODO: paste a real product photo URL here
    },
    {
        productName: "NU Bulldogs Statement Shirt",
        description: "Cotton statement shirt with the NU Bulldogs wordmark across the front.",
        price: 399,
        stock: 70,
        category: "Campus Apparel",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTm90gi1GilJh0ulsF0LRPNx13pYp7jdTHJy8DVMOcYjOU52s8ojnfnqs&s=10", // TODO: paste a real product photo URL here
    },
    {
        productName: "NU Bulldogs Lanyard",
        description: "Woven lanyard with the Bulldogs logo, ideal for ID holders.",
        price: 59,
        stock: 150,
        category: "Campus Apparel",
        image: "https://down-ph.img.susercontent.com/file/8b80fc5a0bdd64e5e312b1441a2f418b", // TODO: paste a real product photo URL here
    },
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Seed categories (skip any that already exist)
        const categoryMap = {};
        for (const name of CATEGORIES) {
            let category = await Category.findOne({ categoryName: name });
            if (!category) {
                category = await Category.create({ categoryName: name });
                console.log(`Created category: ${name}`);
            } else {
                console.log(`Category already exists: ${name}`);
            }
            categoryMap[name] = category._id;
        }

        // 2. Attach products to an existing admin/supplier account (Product.user is optional
        // in the schema, but useful if you later restrict edits to the owning supplier)
        const owner = await User.findOne({ role: { $in: ["admin", "supplier"] } });
        if (!owner) {
            console.log("No admin/supplier account found — products will be created without an owner.");
        }

        // 3. Seed products (skip any with a matching name to avoid duplicates on re-run)
        for (const item of PRODUCTS) {
            const exists = await Product.findOne({ productName: item.productName });
            if (exists) {
                console.log(`Skipped (already exists): ${item.productName}`);
                continue;
            }

            await Product.create({
                productName: item.productName,
                description: item.description,
                price: item.price,
                stock: item.stock,
                category: categoryMap[item.category],
                user: owner ? owner._id : undefined,
                image: item.image || undefined, // fill in the `image` field per product below once you have real photo URLs
            });
            console.log(`Created product: ${item.productName}`);
        }

        console.log("Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Failed to seed products:", error.message);
        process.exit(1);
    }
};

run();
