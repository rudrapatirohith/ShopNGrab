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
    
        //Updating Product stock
        order?.orderItems?.forEach(async(item)=>{
    
            const product = await Product.findById(item?.product?.toString());
            if(!product){
                return next(new ErrorHandler("No Product found with id: ",404));
            }
            product.stock = product.stock - item?.quantity;
            await product.save({validateBeforeSave:false});  //now it wont do checking for validations before saving 
            })
    
        res.status(200).json({success: true,order});
    })
    



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
export const updateOrder = catchAsyncErrors(async (req, res, next) => {

        const order = await Order.findById(req.params.id);
        if (!order) {
            console.error('No order found with id:', req.params.id);
            return next(new ErrorHandler("No orders found with id: " + req.params.id, 404));
        }
        console.log('Order found:', order);

        if (order.orderStatus === 'Delivered') {
            console.error('Order already delivered:', req.params.id);
            return next(new ErrorHandler("You have already delivered this order", 400));
        }

        let productNotFound = false;
        // Update product stock
        for(const item of order.orderItems){
            const product = await Product.findById(item.product.toString());
            if (!product) {
                           productNotFound = true;
                           break
                        }
          product.stock = product.stock - item.quantity;
          await product.save({ validateBeforeSave: false });
                    }
                    if(productNotFound){
                        return next(new ErrorHandler("No Products found with one or more IDs.",404));
                    }

    
        order.orderStatus = req.body.status;
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }

        console.log('Saving updated order');
        await order.save();
        console.log('Order updated successfully');

        res.status(200).json({ success: true });
    }); 



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

async function getSalesData(startDate, endDate) {
    // console.log("Fetching sales data between", startDate, "and", endDate);

    const salesData = await Order.aggregate([
        {
            // Stage 1: Filter results
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                }
            }
        },
        {
            // Stage 2: Group Data
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } }
                },
                totalSales: { $sum: "$totalAmount" },
                numOrder: { $sum: 1 }, // count the number of orders
            }
        },
        {
            // Stage 3: Sort by date
            $sort: { "_id?.date": 1 }
        }
      
    ])

    // create a map to store sales data and num of order by data
    const salesMap = new Map();
    let totalSales = 0;
    let totalNumOrders = 0;
    salesData.forEach((entry) => {
        const date = entry?._id?.date;
        const sales = entry?.totalSales;
        const numOfOrders = entry?.numOrder;

        salesMap.set(date, { sales, numOfOrders });
        totalSales += sales;
        totalNumOrders += numOfOrders;
    })

    // Generate an array of dates between the start date and end date
    const datesBetween = getDatesBetween(startDate, endDate);

    // create final sales data array with 0 for dates without sales
    const finalSalesData = datesBetween.map((date) => ({
        date,
        sales: (salesMap.get(date) || { sales: 0 }).sales,
        numOfOrders: (salesMap.get(date) || { numOfOrders: 0 }).numOfOrders,
    }));
    return { salesData: finalSalesData, totalSales, totalNumOrders };

}

function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        dates.push(formattedDate);
        currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Corrected date increment
    }

    return dates;
}

// Get Sales Data - ADMIN => /api/shopngrab/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
    try {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const { salesData, totalSales, totalNumOrders } = await getSalesData(startDate, endDate);

        res.status(200).json({ totalSales, totalNumOrders, sales: salesData })

    } catch (error) {
        next(error);
    }
})