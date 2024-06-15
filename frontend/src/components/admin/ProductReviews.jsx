import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from "../layouts/Loader"
import {MDBDataTable} from 'mdbreact'
import { Link } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';
import AdminLayout from '../layouts/AdminLayout';
import { useDeleteReviewMutation, useLazyGetProductReviewsQuery } from '../../redux/api/productsApi';

const ProductReviews = () => {

    const [productId,setProductId] = useState("");

const [getProductReviews,{data,isLoading,error}] = useLazyGetProductReviewsQuery();  // to call it in submit handler i used lazygetproductreviews() to call only once if i click that button

const [deleteReview,{error: deleteError,isSuccess,isLoading:isDeleteLoading}]= useDeleteReviewMutation();

useEffect(()=>{
    if(error){
        toast.error(error?.data?.message);
    }      
    if(deleteError){
        toast.error(deleteError?.data?.message);
    }
    if(isSuccess){
        toast.success("Review Deleted");
    }
    console.log(deleteError);
    
},[error,deleteError,isSuccess])

    const submitHandler = (e) => {
        e.preventDefault();
        getProductReviews(productId);
    }
console.log(productId);
    const deleteReviewHandler = (id)=>{
        deleteReview({productId,id})
    }

    const setReviews = () => {

        const reviews = {
            columns:[
                {
                    label:"REVIEW ID",
                    field:"id",
                    sort:"asc",
                },
                {
                    label:"RATING",
                    field:"rating",
                    sort:"asc",
                },
                {
                    label:"COMMENT",
                    field:"comment",
                    sort:"asc",
                },
                {
                    label:"USER",
                    field:"user",
                    sort:"asc",
                },
                {
                    label:"Actions",
                    field:"actions",
                    sort:"asc",
                },
            ],
            rows:[],
        };
console.log(data?.reviews);
        data?.reviews?.forEach((review)=>{
            reviews.rows.push({
                    id: review?._id,                                                                                                               
                    rating: review?.rating,
                    comment: review?.comment,
                    user: review?.user?.name,
                    actions: (
                        <>

                        <button  className="btn btn-outline-danger ms-2" 
                        onClick={()=>deleteReviewHandler(review?._id)} disabled={isDeleteLoading}
                        >
                            <i className="fa fa-trash" >  </i>
                            </button>

                        </>
                    ),
            })
        })
        console.log(reviews);
        // console.log();
        return reviews;
    }

    
    if(isLoading ) return <Loader />



  return (
    <AdminLayout>
      <div className="row justify-content-center my-5">
      <div className="col-6">
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label htmlFor="productId_field" className="form-label">
              Enter Product ID
            </label>
            <input
              type="text"
              id="productId_field"
              className="form-control"
              value={productId}
              onChange={(e)=>setProductId(e.target.value)}
            />
          </div>

          <button
            id="search_button"
            type="submit"
            className="btn btn-primary w-100 py-2"
          >
            SEARCH
          </button>
        </form>
      </div>
    </div>
{data?.reviews?.length>0 ?  

<MDBDataTable

    data={setReviews()}
    className='px-3'
    bproducted
    striped
    hover

    />
 : <p className="mt-5 text-center">No Reviews</p>
}
    </AdminLayout>
  )
}

export default ProductReviews
