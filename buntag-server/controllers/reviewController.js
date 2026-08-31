const Review = require("../models/reviewModel");
const { HttpStatus } = require("../config/constants");

// Supplier/Admin only — every review, for the moderation dashboard
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user", "name")
            .populate("product", "productName")
            .sort({ createdAt: -1 });

        res.status(HttpStatus.OK).json(reviews);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Public — anyone (including guests) can view reviews on a product
exports.getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(HttpStatus.OK).json(reviews);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Customer only — always attributed to the logged-in user, never trust a client-sent user id
exports.createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        const newReview = await Review.create({
            product: productId,
            user: req.user.id,
            rating,
            comment,
        });

        const populated = await newReview.populate("user", "name");
        res.status(HttpStatus.CREATED).json(populated);
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
};

// The review's original author may edit their own review; supplier/admin may
// edit any review (moderation — e.g. removing inappropriate content)
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Review not found" });
        }

        const isOwner = review.user.toString() === req.user.id;
        const isModerator = req.user.role === "admin" || req.user.role === "supplier";
        if (!isOwner && !isModerator) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: "You can only edit your own review" });
        }

        if (req.body.rating !== undefined) review.rating = req.body.rating;
        if (req.body.comment !== undefined) review.comment = req.body.comment;
        await review.save();

        const populated = await review.populate("user", "name");
        res.status(HttpStatus.OK).json(populated);
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
};

// Same ownership rule as edit: author or supplier/admin
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Review not found" });
        }

        const isOwner = review.user.toString() === req.user.id;
        const isModerator = req.user.role === "admin" || req.user.role === "supplier";
        if (!isOwner && !isModerator) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: "You can only delete your own review" });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.status(HttpStatus.OK).json({ message: "Review deleted" });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
