import React, { useEffect, useState } from 'react'
import { useGetProductDetailsQuery } from '../../redux/api/productsApi'
import { useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import Loader from '../layouts/Loader.jsx';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { setCartItem } from '../../redux/features/cartSlice.js';
import PageTitle from '../layouts/PageTitle.jsx';
import NewReview from '../reviews/NewReview.jsx';
import ListReviews from '../reviews/ListReviews.jsx';
import NotFound from '../layouts/NotFound.jsx';

const ProductDetails = () => {

    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState('');
    const params = useParams();
    const dispatch = useDispatch();
    const { data, isLoading, error, isError } = useGetProductDetailsQuery(params?.id);
    const { userAuthenticated } = useSelector((state) => state.auth)


    useEffect(() => {
        setActiveImg(
            data?.product?.images[0] ? data?.product?.images[0]?.url : '/images/default_product.png'
        )
    }, [data?.product])


    useEffect(() => {
        if (isError) {
            console.log(error);
            toast.error(error?.data?.message||'Product Not Found');
        }
    }, [isError,error]);

    const increaseQty = () => {
        const count = document.querySelector(".count");
        if (count.valueAsNumber >= data?.product?.stock) return;
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }

    const decreaseQty = () => {
        const count = document.querySelector(".count");
        if (count.valueAsNumber <= 1) return;
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }

    const SetItemToCart = () => {
        const cartItem = {
            product: data?.product?._id,
            name: data?.product?.name,
            price: data?.product?.price,
            image: data?.product?.images[0]?.url,
            stock: data?.product?.stock,
            quantity
        };
        dispatch(setCartItem(cartItem));
        toast.success("Item Added to Cart");
    };

    
    if (isLoading) {
        return <Loader />
    }
    
    
        if(error && error?.status==404){
            return <NotFound />
        }

    return (
        <>
            <PageTitle title={data?.product?.name} />
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
                    <div className="row justify-content-start mt-5">
                        {data?.product?.images?.map((img) => (

                            <div className="col-2 ms-4 mt-2 mx-4">
                                <a role="button">
                                    <img
                                        className={`d-block border rounded p-3 cursor-pointer img_size ${img.url === activeImg ? "border-warning" : ""} `}
                                        height="100"
                                        width="100"
                                        src={img?.url}
                                        alt={img?.url}
                                        onClick={(e) => setActiveImg(img?.url)}
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
                            starRatedColor="#686868"
                            numberOfStars={5}
                            name="rating"
                            starDimension="22px"
                            starSpacing="5px"
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
                        disabled={data?.product?.stock <= 0}
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

                    {userAuthenticated ? <NewReview productId={data?.product?._id} /> :
                        <div className="alert alert-danger my-5" type="alert">
                            Login to post your review.
                        </div>
                    }
                </div>
            </div>
            {data?.product?.reviews?.length > 0 && <ListReviews reviews={data?.product?.reviews} />}
        </>
    )
}

export default ProductDetails
