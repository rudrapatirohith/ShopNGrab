import express from "express" // importing Express
const app=express() //creating a variable to use exoress
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./config/db.js";
import errorMiddleware from "./middleware/errors.js"

// Handling Uncaught exceptions -> if we wrote any undefined logs like '// console.log(Hi);' then we close the server by showing error
process.on('uncaughtException',(err)=>{
    console.log(`ERROR: ${err}`);
    console.log("Shutting down due to uncaught exception");
    process.exit(1);
})



dotenv.config({path: "Backend/config/config.env"});

// Connecting to database
connectToDatabase();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser()); // handles all cookies

//importing all routes
import productRoutes from "./routes/products.js"

import authRoutes from "./routes/auth.js"

import orderRoutes from "./routes/order.js"

// if someone visits my server at /api/shopvibe/products, they'll be handled by the productRoutes.
app.use("/api/shopngrab",productRoutes);

app.use("/api/shopngrab",authRoutes);

app.use("/api/shopngrab",orderRoutes);

//using error middleware
app.use(errorMiddleware);

//start a server that listens on a specific port, and then logs a message indicating the server is ready to accept connections on that port.
const server=app.listen(process.env.PORT, ()=>{
    console.log(`ShopNGrab Backend Started Listening on PORT: ${process.env.PORT} IN ${process.env.NODE_ENV} mode.`);
})

process.on('unhandledRejection',(err)=>{
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })
})