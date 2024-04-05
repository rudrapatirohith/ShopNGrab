import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            req:[true,"Please Enter your Name"],
            maxLength: [50, " Your name cant exceed 50 Characters"]
        },
        email:{
            type: String,
            req:[true,"Please Enter your email"],
            unique:true
        },
        password:{
            type:String,
            req:[true,"Please enter your Password"],
            minLength:[5,"Your password must be atleast 5 characters"],
            select: false   ///not to show stored passwords in response      
        },
        avatar:{
            public_id: String,
            url: String
        },
        role:{
            type:String,
            default: "user"
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {timestamps:true}  // shows at what its created
);

// Encrypting the password before saving the user details

// pre method is used to define a hook that runs before the event
UserSchema.pre("save",async function(next){  // if we use arrow function we cant use this operator
    if(!this.isModified("password")){
        next(); //  next callback tells Mongoose that it can continue with the save operation. If next is not called, Mongoose will wait indefinitely, and the save operation will never complete.
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt) // hasing the passowrd of length 10
})

// Returns JWT Token
UserSchema.methods.getJwtToken= function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_TIME}) // id of the user is encoded in the token
}

//compares passwords
UserSchema.methods.comparePassword= async function(passwordEntered){      // to use this.password im not using arrow function
    return await bcrypt.compare(passwordEntered,this.password);
}

// Generate password reset token
UserSchema.methods.getResetPasswordToken= async function(){

    // Generating Token
    const resetToken = crypto.randomBytes(15).toString("hex")

    // Hashiing it and setting it to resetPassword feild
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");  // encyrpting that  token to store in db

    this.resetPasswordExpire = Date.now() + 30*60*1000;  // giving 30 mins time 

    return resetToken;

}

export default mongoose.model("User",UserSchema); // creates new model with name user and stores in it in db