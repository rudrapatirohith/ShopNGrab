export default (controllerFunction)=>(req,res,next)=>{
    //to ensure that the function is always treated as returning a promise we use promise.resolve
    // catch(next) - If an error occurs within the controller function, the .catch block catches it and forwards the error to the next error handling middleware in Express.js using the next function. 
    Promise.resolve(controllerFunction(req,res,next)).catch(next);  
}