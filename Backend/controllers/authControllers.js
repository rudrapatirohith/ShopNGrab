import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendTokenInCookie from "../utils/sendToken.js"

// Signin user => /api/shopngrab/sigin
export const Signin = catchAsyncErrors(async(req,res,next)=>{
     
    const{name,email,password}=req.body;

    const user = await User.create({
        name,
        email,
        password
    });

sendToken(user,201,res) // calls sendToken.js and gives response and create cookie
});


// Login User => /api/shopngrab/login
export const login = catchAsyncErrors(async(req,res,next)=>{
    const{email, password}=req.body;

    if(!email || !password){ // if we dont give user or password
        return next(new ErrorHandler("Please enter email & password", 400))
    }
    
    // find user in the database
    const user = await User.findOne({email}).select("+password") 

    if(!user){ // if we dont find email or pass matched we get error
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

    //checks if password is correct
    const isPasswordMatched = await user.comparePassword(password) //calls that bcrypt.comapre and compare this with hashed pass
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

    sendToken(user,200,res) // calls sendToken.js and gives response and create cookie
})

