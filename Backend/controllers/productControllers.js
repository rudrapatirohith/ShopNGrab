// This is a placeholder for where you'd normally interact with a database to retrieve and send back actual product data.
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilters.js";
import order from "../models/order.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// gets all Product details GET => /api/shopngrab/products
export const getProducts= catchAsyncErrors(async (req,res,next)=>{

    const resPerPage=4;
    //creates a new instance of APIFilters by passing the product model and the request query string (req.query) to the constructor.
    // The search method constructs a case-insensitive filter object that matches the 'name' field of products against a provided keyword, such as 'apple', by converting both to lowercase.
    const apiFilters = new APIFilters(Product,req.query).search().filters(); 

    let products = await apiFilters.query.sort({name: 1}); // returns the filtered list of products that match the keyword.

    let filterProductsCount =  products.length // finds the number of products we have after filtering

    apiFilters.pagination(resPerPage); // worked on pagination to show 4 products per page
 
    //allowing it to be executed multiple times independently, as a single query cannot be executed more than once im using clone to create a copy of mongoose query object
    products = await apiFilters.query.clone().sort({ name: 1 }); // Sort again after pagination

    res.status(200).json({resPerPage,filterProductsCount,products,})

}
);


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Creating /adding new Product  POST => /api/shopngrab/admin/products
export const newProduct=catchAsyncErrors( async (req,res)=>{

    req.body.user = req.user._id; // sets user id in user place in prod creation
   const product = await Product.create(req.body)  // creates and saves data in db
    res.status(200).json({product,})
}
);


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Get Products details based on id  GET=> /api/shopngrab/admin/products/:id
export const getProductDetails = catchAsyncErrors(async(req,res,next)=>{

    const { id } = req.params;

     // Check if the ID is valid
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler('Product not found', 404));
    }

    const product = await Product.findById(req?.params?.id).populate('reviews.user')

    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
    res.status(200).json({product})
}
);


//------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Get Products - ADMIN  GET=> /api/shopngrab/admin/products
export const getAdminProducts = catchAsyncErrors(async(req,res,next)=>{
    const products = await Product.find()
    res.status(200).json({products})
}
);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Upload  Product images    PUT => /api/shopngrab/admin/products/:id/upload_images
export const uploadProductImages = catchAsyncErrors(async(req,res)=>{
    let product = await Product.findById(req?.params?.id)
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }

    const uploader = async(image)=> upload_file(image,"shopngrab/products")

    const urls = await Promise.all((req?.body?.images).map(uploader))

    product?.images?.push(...urls);
if (!product.user) {
    product.user = req.user.id; // Assuming `req.user` contains the authenticated user's info
}
    await product?.save()
      res.status(200).json({product})
}
);


//------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Delete  Product images    PUT => /api/shopngrab/admin/products/:id/delete_image
export const deleteProductImage = catchAsyncErrors(async(req,res)=>{
    let product = await Product.findById(req?.params?.id)
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }

    const isDeleted = await delete_file(req.body.imgId);

    if(isDeleted){
        product.images = product?.images?.filter(

            (img)=>img.public_id !== req.body.imgId
        )
    await product?.save()
    }
    
      res.status(200).json({product})
}
);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Delete product    DELETE => //api/shopngrab/admin/products/:id
export const deleteProductDetails = catchAsyncErrors(async(req,res)=>{
    let product = await Product.findById(req?.params?.id)
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }

    // Deleting image assosiated with product
for(let i=0;i<product?.images?.length;i++){
    await delete_file(product?.images[i].public_id);
}

    await product.deleteOne();
    res.status(200).json({message:'Product Deleted'})
}
);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Create / Update product review => /api/shopngrab/reviews
export const createProductReview = catchAsyncErrors(async(req,res,next)=>{
    const { rating,comment,productId} = req.body;
    const review = {
        user: req?.user?._id,
        rating:Number(rating),
        comment,
    }

    const product = await Product.findById(productId);
    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }
    const isReviewed = product?.reviews.find(
        (rev)=>rev.user.toString()===req?.user?._id.toString()
    )

    if(isReviewed){  
        product.reviews.forEach((review)=>{ // its a for loop to check every value like user,comment,rating in reviews
            if(review?.user?.toString()===req?.user?._id.toString()){ //if user who posted the review is matched with id of the user it will just update
                review.comment=comment,
                review.rating=rating;
            }
        })
    }
    else{
        product.reviews.push(review);  // if not itll will push the data to that array
        product.numOfReviews=product.reviews.length;
    }
     // reduce is used to work on accumulate which adds all reviews starting with 0 value and divide it with no of reviews to get avg 
    product.ratings= product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length;

    await product.save({validateBeforeSave:false});  // to ignore validations
    res.status(200).json({success: true})
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Get Product Reviews => /api/shopngrab/reviews/:id
export const getProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id).populate('reviews.user');
    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }
   res.status(200).json({reviews: product.reviews,})
});

//------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Delete Product Review => api/shopngrab/reviews
export const deleteReview = catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.query.productId);  // we give product id in params
    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }

    // checks for the reviewws and if review id matches with the review id given in params it will be ignored
    const reviews = product?.reviews?.filter(
        (review)=> review._id.toString()!==req?.query?.id.toString()
    )

    const numOfReviews = reviews.length;// updates the nop of reviews

    // if no of reviews is 0 then ratings will be 0 if not it will calculate all review.rating and divide by total reviews
    const ratings = 
    numOfReviews === 0           
    ? 0
    : product.reviews.reduce((acc,item)=> item.rating+acc,0)/numOfReviews;

    product = await Product.findByIdAndUpdate(req.query.productId,{reviews,numOfReviews,ratings},{new:true}) // find and update the product by id by assiging above values

    res.status(200).json({success:true,product})
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Can user Review => /api/shopngrab/can_review
export const canUserReview = catchAsyncErrors(async(req,res,next)=>{
    const orders = await order.find({
        user: req.user._id,
        "orderItems.product": req.query.productId,
    });
    if(orders.length===0){
        return res.status(200).json({canReview: false})
    }
   res.status(200).json({canReview: true})
});