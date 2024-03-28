// This is a placeholder for where you'd normally interact with a database to retrieve and send back actual product data.
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilters.js";


// gets all Product details GET => /api/shopngrab/products
export const getProducts= catchAsyncErrors(async (req,res)=>{

    const resPerPage=4;
    //creates a new instance of APIFilters by passing the product model and the request query string (req.query) to the constructor.
    // The search method constructs a case-insensitive filter object that matches the 'name' field of products against a provided keyword, such as 'apple', by converting both to lowercase.
    const apiFilters = new APIFilters(Product,req.query).search().filters(); 

    let products = await apiFilters.query; // returns the filtered list of products that match the keyword.

    let filterProductsCount =  products.length // finds the number of products we have after filtering

    apiFilters.pagination(resPerPage); // worked on pagination to show 4 products per page
 
    //allowing it to be executed multiple times independently, as a single query cannot be executed more than once im using clone to create a copy of mongoose query object
    products = await apiFilters.query.clone(); 

    res.status(200).json({resPerPage,filterProductsCount,products,})
}
);

// Creating /adding new Product  POST => /api/shopngrab/admin/products
export const newProduct=catchAsyncErrors( async (req,res)=>{
   const product = await Product.create(req.body)  // creates and saves data in db
    res.status(200).json({product,})
}
);

// Get Products details based on id  GET=> /api/shopngrab/admin/products/:id
export const getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req?.params?.id)

    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
    res.status(200).json({product})
}
);

// Update  Product   PUT => /api/shopngrab/admin/products/:id
export const updateProductDetails = catchAsyncErrors(async(req,res)=>{
    let product = await Product.findById(req?.params?.id)
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
    product= await Product.findByIdAndUpdate(req?.params?.id, req.body,
        { new : true } )    // checks the id and if its correct and will check what req we got in body i mean what change and new: true will update the data
    res.status(200).json({product})
}
);

// Delete product    DELETE => //api/shopngrab/admin/products/:id
export const deleteProductDetails = catchAsyncErrors(async(req,res)=>{
    let product = await Product.findById(req?.params?.id)
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
    product = await Product.findByIdAndDelete(req?.params?.id)
    res.status(200).json({message:'Product Deleted'})
}
);