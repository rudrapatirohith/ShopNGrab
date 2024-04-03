import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import { getPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";

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




// Logout User => /api/shopngrab/logout
export const logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie('token',null,{expires:new Date(Date.now()), httpOnly: true}) // here we will expire that token so there will be no cookie
    res.status(200).json({
        message: 'Logged out successfully'
    })
})




// Forgot Password => /api/shopngrab/forgot/password
export const forgotPassword = catchAsyncErrors(async(req,res,next)=>{
   
    // find email in the database with entered email
    const user = await User.findOne({email:req.body.email}) 

    if(!user){ // if we dont find email matched we get error
        return next(new ErrorHandler("We havent found any user with this email",404))
    }

    //Get Token to Reset Password
    const resetToken =  user.getResetPasswordToken() 

    await user.save() // saves both the values resetpasstoken and resetpasssexpire in db

    const resetUrl = `${process.env.FRONTEND_URL}/api/shopngrab/password/reset/${resetToken}`;

    const message = getPasswordTemplate(user?.name,resetUrl);

    try {
        
        await sendEmail({
            email: user.email,
            subject: "ShopNgrab Password Recovery",
            message,
        })
        res.status(200).json({message:`Email has been sent to ${user.email}`})

    } catch (error) {
        user.resetPasswordExpire=undefined;
        user.resetPasswordToken=undefined;

        await user.save();
        return next(new ErrorHandler(error?.message,500))
    }
    // sendToken(user,200,res) // calls sendToken.js and gives response and create cookie
})

