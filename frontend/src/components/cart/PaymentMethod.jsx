import React, { useEffect, useState } from 'react'
import PageTitle from '../layouts/PageTitle'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux';
import { calculateOrderCost } from '../../helpers/helpers';
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PaymentMethod = () => {

    const [method,setMethod] = useState("");
    const navigate = useNavigate();
    const {shippingInfo,cartItems} = useSelector((state)=>state.cart);
 
   const[createNewOrder , {error,isSuccess}]= useCreateNewOrderMutation();

   const[stripeCheckoutSession, {data: checkoutData,error: checkoutError,isLoading}]=useStripeCheckoutSessionMutation()

   useEffect(()=>{
    if(checkoutData){
      console.log(checkoutData);
      window.location.href = checkoutData?.url;
    }
    if(checkoutError){
      console.log(checkoutError);
      toast.error(checkoutError?.data?.message)
    }
   },[checkoutData,checkoutError]);


   useEffect(()=>{
    if(error){
      console.log(error);
      toast.error(error?.data?.message)
    }

    if(isSuccess){
      toast.success("Order Placed")
      navigate("/me/orders?order_success=true");
    }
   },[error,isSuccess]);

    const submitHandler = (e) =>{
        e.preventDefault();

        const{itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice}=  calculateOrderCost(cartItems)

        if(method==="COD"){
            //create COD order
           const orderData = {
            shippingInfo,
            orderItems : cartItems,
            itemsPrice,
            shippingAmount:shippingPrice,
            taxAmount: taxPrice,
            totalAmount:totalPrice,
            paymentInfo:{
                status:"Not Paid"
            },
            paymentMethod: "COD",
           };
           console.log(orderData)
           createNewOrder(orderData);
           
        }
        else if(method==="Card"){
            //stripe checkout
            const orderData = {
              shippingInfo,
              orderItems : cartItems,
              itemsPrice,
              shippingAmount:shippingPrice,
              taxAmount: taxPrice,
              totalAmount:totalPrice,
             };
            //  console.log(orderData)
             stripeCheckoutSession(orderData);
          }
          else{
            toast.error("Please select a payment method");
          }
        }
    

  return (
    <>
    <PageTitle title={'Payment Method'} />
    <CheckoutSteps shipping confirmOrder payment />
      <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Select Payment Method</h2>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="codradio"
              value="COD"
              onChange={(e)=>setMethod("COD")}
            />
            <label className="form-check-label" htmlFor="codradio">
              Cash on Delivery
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="cardradio"
              value="Card"
              onChange={(e)=>setMethod("Card")}
            />
            <label className="form-check-label" for="cardradio">
              Card - VISA, MasterCard
            </label>
          </div>

          <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
            CONTINUE
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default PaymentMethod
