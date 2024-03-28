// create token and save it in cookie

export default(user,statusCode,res)=>{

    // Create a JWT Token
    const token = user.getJwtToken(); // we get the token from user.js

    // Options for cookie
    //httpOnly is used to show cookie only in backend not in frontend
    // as we get in milli seconds we do *1000
    const options = {
        expires: new Date(Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000), httpOnly: true, 
    }
    res.status(statusCode).cookie("token",token,options).json({token}) // create both cookie and shows json response
}