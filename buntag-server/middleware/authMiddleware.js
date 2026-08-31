const jwt = require("jsonwebtoken");

// Verifies the JWT and attaches the decoded user to req.user
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    };

    // Usage: checkRole('admin') or checkRole('admin', 'supplier')
    const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "You do not have access to this resource" });
        }
        next();
    };
};

// Allows a user to act on their OWN record (req.params.id matches their token id),
// or lets an admin act on anyone's record. Used for profile view/edit.
const selfOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "No token provided" });
    }
    if (req.user.role === "admin" || req.user.id === req.params.id) {
        return next();
    }
    return res.status(403).json({ message: "You can only access your own account" });
};

// Attaches req.user but does not fail if there's no token — used for routes
// that behave differently for guests vs logged-in users (e.g. browsing products).
const attachUserIfPresent = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }
    const token = authHeader.split(" ")[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        // Invalid/expired token on an optional-auth route — just proceed as a guest
    }
    next();
};

module.exports = { verifyToken, checkRole, selfOrAdmin, attachUserIfPresent };