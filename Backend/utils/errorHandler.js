class ErrorHandler extends Error{ // Here now ErrorHandler will have all the features of Error plus whatever new or overridden functionality we add to it.
    // special method for creating and initializing objects created with the class. 
    //The constructor takes two parameters: message, which is a string describing the error, and statusCode, which is a number representing the HTTP status code associated with the error.
    constructor(message,statusCode){ 
        super(message); //  initialize the base class part of the instance.
        this.statusCode=statusCode; 

        // Create Stack property
        Error.captureStackTrace(this,this.constructor);
    }
}

export default ErrorHandler;