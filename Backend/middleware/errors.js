import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next)=> {

    let error = {
        statusCode: err?.statusCode || 500, // if err.statuscode not defined then we get 500 by default
        message: err?.message || 'Internal Server Error', // if err.statuscode not defined then we get the mesg by default
    };

    // Handle Invalid Mongoose ID Error- if we gave wrong mongoose path
    if(err.name==='CastError'){
        const message = `Resource not found. Invalid: ${err?.path}`;
        error = new ErrorHandler(message,404);
    }
    
    // Handle Validation Error- if we miss any section to fill in product details it will show what we missed
    if(err.name==='ValidationError'){
        const message = Object.values(err.errors).map((value)=>value.message);
        error = new ErrorHandler(message,400);
    }

    // Handle Mongoose Duplicate Key Error- if we same email exists
    if(err.code===11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler(message,400);
    }

    // Handle Invalid JWT error - if jwt verify fails to match tokens in middleware/auth.js in userAuthenticated we set this error
    if(err.name==='JsonWebTokenError'){
        const message = `JSON Web Token is invalid. Try Again!`;
        error = new ErrorHandler(message,400);
    }

    // Handle expired JWT Error - if cookie token expires 
    if(err.name==='TokenExpiredError'){
        const message=`JSON Web Token is expired. Try again!`;
        error = new ErrorHandler(message,400);
    }
    
    

    if(process.env.NODE_ENV==='DEVELOPMENT'){ // in dev we show error and stack additionally
        res.status(error.statusCode).json({
            message:error.message,
            error: err, //shows statuscode
            stack: err?.stack,
        })

    }

    if(process.env.NODE_ENV==='PRODUCTION'){
        res.status(error.statusCode).json({message:error.message})
    }
}