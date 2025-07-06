import jwt from "jsonwebtoken"
import User from "../models/User.model.js"

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                success:false,
                error:"Unauthorized : No token provided"
            });
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({
                success:false,
                error:"user not found"
            })
        }

        req.user=user;
        next();
        
    } catch (error) {
        console.error(`error in protectedRoute Middleware ${error.message}`);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                error: "Unauthorized: Invalid or expired token"
            });
        }
        return res.status(500).json({
            success:false,
            error:"Internal server error"
        })
    }
}