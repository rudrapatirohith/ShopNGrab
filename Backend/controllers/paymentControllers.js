import catchAsyncErrors from "../middleware/catchAsyncErrors.js"
import Stripe from "stripe"

const stripe =new Stripe(process.env.STRIPE_SECRET_KEY)


// Create Stripe checkout session => /api/shopNgrab/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(async(req,res,next)=>{

    const body = req?.body

    const line_items = body?.orderItems?.map((item)=>{
        return{
            price_data:{
                currency:"usd",
                product_data:{
                    name: item?.name,
                    images: [item?.image],
                    metadata: {productId: item?.product}, // we use metadata to give additional info 
                },
                unit_amount : item?.price * 100, // in stripe we get it in cents so we multiply with 100
            },
            tax_rates: ["txr_1POPqTRtlmbGiOakOi9vVJUT"],
            quantity: item?.quantity,
        }
    })

    const shippingInfo = body?.shippingInfo

    const shipping_rate =body?.itemsPrice >= 200 ? "shr_1POPmyRtlmbGiOakAhk9hWGE"
    : "shr_1POPnjRtlmbGiOakVtDvhWnI";

    try {
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: `${process.env.FRONTEND_URL}/profile/orders`,
            cancel_url: `${process.env.FRONTEND_URL}`,
            customer_email: req?.user?.email,
            client_reference_id: req?.user?._id?.toString(),
            mode: "payment",
            metadata: {...shippingInfo,itemsPrice: body?.itemsPrice},
            shipping_options:[
                {
                    shipping_rate,
                },
            ],
            line_items,
        });
    
        console.log("----------------");
        console.log(session);
        console.log("----------------");
        res.status(200).json({url: session.url,})
    
    } catch (error) {
        console.error("Error creating Stripe session:", error);
      return res.status(500).json({ error: "Failed to create Stripe session" });
    }
});