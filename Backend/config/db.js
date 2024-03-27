import mongoose from "mongoose";

export const connectToDatabase=()=>{

    let DB_URI =""
// takes the db sustring depending upon environment
    if(process.env.NODE_ENV==="DEVELOPMENT") DB_URI=process.env.DB_LOCAL_URI;
    if(process.env.NODE_ENV==="PRODUCTION") DB_URI=process.env.DB_URI;

    //connecting with dp and logging it in terminal
    mongoose.connect(DB_URI).then((con)=>{
        console.log(`MongoDB Database connected with HOST: ${con?.connection?.host}`);
    });
};