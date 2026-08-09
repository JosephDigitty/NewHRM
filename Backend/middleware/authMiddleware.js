import jwt from "jsonwebtoken";
import User from "../model/user.js"; // Ensure User is imported to query the DB

// Middleware to verify user token before accessing protected routes
const verifyUser = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(404).json({ success: false, error: "Token not found" });
        }

        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (!decoded) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        // Fetch the user from the DB using the decoded user ID
        const user = await User.findById(decoded._id).select('-password');  // Exclude password

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Attach user info to the request object
        req.user = user;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error" });
    }
};

export default verifyUser;
