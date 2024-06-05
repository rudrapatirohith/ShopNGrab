import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/product.js";

// Create new Order => /api/shopngrab/orders/new    --- for cod we are checking this route

export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod,
        user: req.user._id,
    })
    res.status(200).json({
        success: true,
        order,
    })

})


//     //Updating Product stock
//     order?.orderItems?.forEach(async(item)=>{

//         const product = await Product.findById(item?.product?.toString());
//         if(!product){
//             return next(new ErrorHandler("No Product found with id: ",404));
//         }
//         product.stock = product.stock - item?.quantity;
//         await product.save({validateBeforeSave:false});  //now it wont do checking for validations before saving 
//         })

//     res.status(200).json({order});
// })




// Get Order Details => /api/shopngrab/orders/:id
export const getOrderDetails = catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email"); // shows name email of user in res and store in db as we using populate
    if(!order){
        return next(new ErrorHandler("No orders found with id: ",404));
    }

    res.status(200).json({order});
})



// Get Current user Order Details => /api/shopngrab/profile/orders
export const myOrders= catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.find({user: req.user._id}).populate("user","name email"); // shows name email of user in res and store in db as we using populate

    if(!order){
        return next(new ErrorHandler("No orders found", 404));
    }
    res.status(200).json({order,});
})


// Get all Order Details - ADMIN => /api/shopngrab/admin/orders
export const allOrders= catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.find().populate("user","name email"); // shows name email of user in res and store in db as we using populate
    res.status(200).json({order});
})


// Update Order Details - ADMIN => /api/shopngrab/admin/orders/:id
export const updateOrder= catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("No orders found with id: ",404));
    }
    if(order?.orderStatus==='Delivered'){
        return next(new ErrorHandler("You Have already delivered this order",400));
    }

    order.orderStatus=req.body.status;
    order.deliveredAt=Date.now();

    await order.save();
    res.status(200).json({success: true});
})

// Delete Order Details - ADMIN => /api/shopngrab/admin/orders/delete/:id
export const deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    let order = await Order.findById(req?.params?.id);
    if(!order){
        return next(new ErrorHandler("No orders found with id: ",404));
    }
    // order = await Order.findByIdAndDelete(req?.params?.id);
    await order.deleteOne();
    res.status(200).json({message:'Order Deleted'})

})