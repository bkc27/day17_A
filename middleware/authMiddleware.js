const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token Not Found"
            });
        }
        // Now work with token...
        // let name = "Bearer lasdjflkasjgkl;ajg;klasdhfglkadjg;lasjdgk;hsdfgkl;jdag"
        let token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id).select("-password");
        // without password...
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            });
        }
        console.log("Middleware wala User", user);
        req.user = user;
        next();
    }
    catch (err) {
        console.log("Some error in authentication", err);
        return res.json({
            success: false,
            message: "Invalid Token"
        })
    }
};

module.exports = authMiddleware;