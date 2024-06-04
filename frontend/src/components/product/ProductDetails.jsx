import React, { useEffect, useState } from 'react'
import { useGetProductDetailsQuery } from '../../redux/api/productsApi'
import { useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import Loader from '../layouts/Loader.jsx';
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { setCartItem } from '../../redux/features/cartSlice.js';

const ProductDetails = () => {
    
    const [quantity,setQuantity] = useState(1);
    const[activeImg, setActiveImg] = useState('');
    const params = useParams();
    const disaptch = useDispatch();
    const { data ,isLoading,error,isError} = useGetProductDetailsQuery(params?.id);



    useEffect(()=>{
        setActiveImg(
            data?.product?.images[0] ? data?.product?.images[0]?.url : '/images/default_product.png'
        )
    },[data?.product])


    useEffect(()=>{
        if(isError){
          toast.error(error?.data?.message);
        }
      },[isError]);
      
      const increaseQty = ()=>{
          const count = document.querySelector(".count");
          if(count.valueAsNumber>=data?.product?.stock) return;
          const qty = count.valueAsNumber+1;
          setQuantity(qty);
      }
  
      const decreaseQty=()=>{
      const count = document.querySelector(".count");
      if(count.valueAsNumber<=1)return;
      const qty = count.valueAsNumber-1;
      setQuantity(qty);
      }

      const SetItemToCart = () => {
        const cartItem = {
            product:data?.product?._id,
            name:data?.product?.namr,
            price:data?.product?.price,
            image:data?.product?.images[0]?.url,
            stock:data?.product?.stock,
            quantity
        };
        disaptch(setCartItem(cartItem))
      };


    if(isLoading){
       return <Loader />
    }


    return (
        <>
            <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <div className="p-3">
                        <img 
                            className="d-block w-100"
                            src={activeImg}
                            alt={data?.product?.name}
                            width="340"
                            height="390"
                        />
                    </div>
                    <div  className="row justify-content-start mt-5">
                        {data?.product?.images?.map((img)=>(
                            
                            <div className="col-2 ms-4 mt-2 mx-4">
                                <a role="button">
                                    <img
                                        className={`d-block border rounded p-3 cursor-pointer img_size ${img.url === activeImg ? "border-warning": ""} `}
                                        height="100"
                                        width="100"
                                        src={img?.url}
                                        alt={img?.url}
                                        onClick={(e)=> setActiveImg(img?.url)}
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{data?.product?.name}</h3>
                    <p id="product_id">Product id: {data?.product?._id}</p>

                    <hr />

                    <div className="d-flex">
                        <StarRatings
                            rating={data?.product?.ratings}
                            starRatedColor="#ECB056"
                            numberOfStars={5}
                            name='rating'
                            starDimension='22px'
                            starSpacing='1px'
                        />
                        <span id="no-of-reviews" className="pt-1 ps-2"> ({data?.product?.numOfReviews} Reviews) </span>
                    </div>
                    <hr />

                    <p id="product_price">$ {data?.product?.price}</p>
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                        <input
                            type="number"
                            className="form-control count d-inline"
                            value={quantity}
                            readonly
                        />
                        <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                    </div>
                    <button
                        type="button"
                        id="cart_btn"
                        className="btn btn-primary d-inline ms-4"
                        disabled={data?.product?.stock<=0}
                        onClick={SetItemToCart}
                    >
                        Add to Cart
                    </button>

                    <hr />
                    
                    <p>
                        Status: <span id="stock_status" className={data?.product?.stock > 0 ? "greenColor" : "redColor"}>{data?.product?.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                    </p>

                    <hr />

                    <h4 className="mt-2">Description:</h4>
                    <p>
                    {data?.product?.description}
                    </p>
                    <hr />
                    <p id="product_seller mb-3">Sold by: <strong>{data?.product?.seller}</strong></p>

                    <div className="alert alert-danger my-5" type="alert">
                        Login to post your review.
                    </div>
                </div>
            </div>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>

            <script src="https://kit.fontawesome.com/9edb65c86a.js"></script>
        </>
    )
}

export default ProductDetails
