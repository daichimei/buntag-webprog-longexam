const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const { HttpStatus } = require("../config/constants");

// ==========================================
// GET PRODUCTS
// Public — customers, suppliers, admins
// ==========================================
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        // Category filter
        if (req.query.category) {
            const category = await Category.findOne({
                categoryName: req.query.category,
            });

            if (!category) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: "Category not found",
                });
            }

            filter.category = category._id;
        }

        // Stock filter
        if (req.query.inStock === "true") {
            filter.stock = { $gt: 0 };
        }

        // Search filter
        if (req.query.search) {
            filter.productName = {
                $regex: req.query.search,
                $options: "i",
            };
        }

        // Sort
        let sort = {};

        if (req.query.sort) {
            const sortField = req.query.sort.startsWith("-")
                ? req.query.sort.substring(1)
                : req.query.sort;

            const sortOrder = req.query.sort.startsWith("-")
                ? -1
                : 1;

            sort[sortField] = sortOrder;
        }

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .populate("category", "categoryName")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return res.status(HttpStatus.OK).json({
            success: true,
            message: "Products retrieved successfully",
            count: products.length,
            pagination: {
                currentPage: page,
                limit,
                totalProducts: total,
                totalPages: Math.ceil(total / limit),
            },
            data: products,
        });
    } catch (error) {
        console.error("getProducts error:", error);

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// GET PRODUCT BY ID
// ==========================================
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        ).populate("category", "categoryName");

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(HttpStatus.OK).json({
            success: true,
            message: "Product retrieved successfully",
            data: product,
        });
    } catch (error) {
        console.error("getProductById error:", error);

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// CREATE PRODUCT
// Supplier + Admin
// ==========================================
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            ...req.body,

            // Supplier owns the product.
            // Admin can also create products.
            user: req.user.id,
        });

        const savedProduct = await newProduct.save();

        return res.status(HttpStatus.CREATED).json({
            success: true,
            message: "Product created successfully",
            data: savedProduct,
        });
    } catch (error) {
        console.error("createProduct error:", error);

        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// UPDATE PRODUCT
// Supplier can update own products.
// Admin can update any product.
// ==========================================
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Product not found",
            });
        }

        // ======================================
        // SUPPLIER OWNERSHIP CHECK
        // ======================================
        if (
            req.user.role === "supplier" &&
            product.user &&
            product.user.toString() !== req.user.id.toString()
        ) {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message:
                    "You can only update your own products",
            });
        }

        // ======================================
        // ONLY ALLOW EDITABLE FIELDS
        // ======================================
        const {
            productName,
            description,
            price,
            stock,
            image,
            category,
            isActive,
        } = req.body;

        const updateData = {
            productName,
            description,
            price,
            stock,
            image,
            category,
            isActive,
        };

        // Remove undefined fields
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        console.log("Updating product:", {
            id: req.params.id,
            user: req.user.id,
            role: req.user.role,
            updateData,
        });

        // ======================================
        // UPDATE
        // ======================================
        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            ).populate("category", "categoryName");

        if (!updatedProduct) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(HttpStatus.OK).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("updateProduct error:", error);

        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// DELETE PRODUCT
// Supplier can delete own products.
// Admin can delete any product.
// ==========================================
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Product not found",
            });
        }

        // Supplier ownership check
        if (
            req.user.role === "supplier" &&
            product.user &&
            product.user.toString() !== req.user.id.toString()
        ) {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message:
                    "You can only delete your own products",
            });
        }

        await Product.findByIdAndDelete(
            req.params.id
        );

        return res.status(HttpStatus.OK).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("deleteProduct error:", error);

        return res.status(
            HttpStatus.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: error.message,
        });
    }
};