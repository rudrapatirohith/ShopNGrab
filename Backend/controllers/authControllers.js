import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import { getPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { nextTick } from "process";
import { delete_file, upload_file } from "../utils/cloudinary.js";

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

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------


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

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Logout User => /api/shopngrab/logout
export const logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie('token',null,{expires:new Date(Date.now()), httpOnly: true}) // here we will expire that token so there will be no cookie
    res.status(200).json({
        message: 'Logged out successfully'
    })
})

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Upload User Avatar=> /api/shopngrab/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async(req,res,next)=>{

    
    const avatarResponse = await upload_file(req.body.avatar,"shopNgrab/avatars");

    //Remove previous avatar
    if(req?.user?.avatar?.url){
        await delete_file(req?.user?.avatar?.public_id);
    }
    const uploadedAvatar=await User.findByIdAndUpdate(req?.user?._id,{avatar:avatarResponse});
      res.status(200).json({
        message:"uploaded",
    })
})
// export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
//     try {
//         // Log the incoming request body to debug
//         console.log("Request Body:", req.body);

//         if (!req.body.avatar) {
//             return res.status(400).json({ message: "Avatar file is required" });
//         }

//         const avatarResponse = await upload_file(req.body.avatar, "shopNgrab/avatars");
        
//         // Log the avatar response to debug
//         console.log("Avatar Response:", avatarResponse);

//         const user = await User.findByIdAndUpdate(
//             req.user._id,
//             { avatar: avatarResponse },
//             { new: true, runValidators: true }
//         );

//         // Log the updated user to debug
//         console.log("Updated User:", user);

//         res.status(200).json({
//             user,
//         });
//     } catch (error) {
//         console.error("Upload Avatar Error:", error); // Log the error
//         res.status(500).json({ message: error.message });
//     }
// });

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Forgot Password => /api/shopngrab/forgot/password
export const forgotPassword = catchAsyncErrors(async(req,res,next)=>{
   
    // find email in the database with entered email
    const user = await User.findOne({email:req.body.email}) 

    if(!user){ // if we dont find email matched we get error
        return next(new ErrorHandler("We havent found any user with this email",404))
    }

    //Get Token to Reset Password
    const resetToken =  await user.getResetPasswordToken() 

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


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Reset Password => /api/shopngrab/password/reset:token
export const resetPassword = catchAsyncErrors(async(req,res,next)=>{

    // Hash the URL Token
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken, //checks whether this is there in db
        resetPasswordExpire: {$gt:Date.now()} // if this is greatweer than current time token wont expire
    })

    if(!user){
        return next(new ErrorHandler("Password reset Token is Invalid or has been Expired",400))
    }

    if(req.body.password!==req.body.confirmpassword){
        return next(new ErrorHandler("Passwords doesn't Match",400))
    }

    //if yes , setting the new password
    user.password=req.body.password

    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;

    await user.save(); // this will call pre function and if pass is modified it iwll automically hash

    sendToken(user,200,res);
})

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Get current user profile => /api/shopngrab/profile
export const getUserProfile=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req?.user?._id);

    res.status(200).json({user})
})

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

//update Password => /api/shopngrab/password/update
export const updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req?.user?._id).select("+password"); //as we kept select as false for password to show in db we use tbis select (+password) to get the password

    // checking the previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }

    user.password=req.body.password;
    user.save();

    res.status(200).json({success: true})
})


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

//update user profile => /api/shopngrab/profile/update
export const updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = { 
        name : req.body.name,
        email : req.body.email, 
    };
    const user=await User.findByIdAndUpdate(req.user._id,newUserData,{new:true}) // checks user id and updates email and name if its changed itll update as new is set to true
    res.status(200).json({user})
})


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

//get all users => /api/shopngrab/admin/users
export const getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.find();
    res.status(200).json({user})
})

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

//get user details => /api/shopngrab/admin/users/:id
export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`,404));
        }
    res.status(200).json({user})
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------
//update user => /api/shopngrab/admin/users/update/:id
export const updateUser= catchAsyncErrors(async(req,res,next)=>{
    const newUserDetails = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
    const user = await User.findByIdAndUpdate(req.params.id,newUserDetails,{new:true})
    res.status(200).json({user})
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------
//delete user => /api/shopngrab/admin/users/delete/:id
export const deleteUser = catchAsyncErrors(async(req,res,next)=>{
    let user= await User.findById(req?.params?.id)
    if(!user){
        return next(new ErrorHandler("User not found",404))
    }
    user = await User.findByIdAndDelete(req?.params?.id)
    res.status(200).json({message:"User Deleted Successfully"})

})