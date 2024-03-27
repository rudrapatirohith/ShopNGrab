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