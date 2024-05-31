import jwt from "jsonwebtoken"
// import ErrorHandler from "../utils/errorHandler";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/user.js";


// checking whether user is authenticated or not
export const userAuthenticated = catchAsyncErrors(async (req,res,next)=>{
    const {token} = req.cookies; // as i saved token in cookie i need to get that to validate

    if(!token){
        return next(new ErrorHandler('Login to access this',401))
    }


    const decoder = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoder.id); // finds user with the user with the id fetched from token and matches the user and stores user data in req.body
    next();
});


// Authorize user roles

export const authorizeRoles = (...roles) => {
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this`,403))
        }
        next();
    }
}