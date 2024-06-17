import mongoose from "mongoose"
import Product from "../models/product.js";
import products from "./data.js"

const seedProducts= async ()=>{
    try {
        await mongoose.connect("mongodb+srv://rudrapatirohith:Rohith%401257@shopngrab.qzq03bm.mongodb.net/shopngrab?retryWrites=true&w=majority&appName=shopngrab"); //2 - connected to db

        await Product.deleteMany(); // 3 - delete all the products
        console.log("Products are Deleted");

        await Product.insertMany(products); // 4 - add  the products from product.js
        console.log("Products are added");

        process.exit(); // 5- Exits the process

    } catch (error) {
        
        console.log(error.message);
        process.exit(1);
    }
};

seedProducts(); //1- it will be called first