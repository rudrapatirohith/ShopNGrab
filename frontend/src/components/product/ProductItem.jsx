import React from 'react'
import { Link } from 'react-router-dom'
import StarRatings from 'react-star-ratings';


const ProductItem = ({product,columnSize }) => {
  console.log(columnSize);
  return (
   <>
   {/* // if kwyword there we use 4 column size else we use 3 column size */}
   <div className={`col-sm-12 col-md-6 col-lg-${columnSize} my-3`}>  
                <div className="card p-3 rounded product-card">
                  <img
                    className="card-img-top mx-auto product-image"
                    src={product?.images[0] ? product?.images[0]?.url : '/images/default_product.png'}
                    alt={product?.name}
                  />
                  <div
                    className="card-body ps-3 d-flex justify-content-center flex-column"
                  >
                    <h5 className="card-title">
                      <Link to={`/product/${product?._id}`}>{product?.name}</Link>
                    </h5>
                    <div className="ratings mt-auto d-flex">
                      <StarRatings
                        rating={product?.ratings}
                        starRatedColor="#949494"
                        numberOfStars={5}
                        name='rating'
                        starDimension='22px'
                        starSpacing='1px'
                      />
                      <span id="no_of_reviews" className="pt-2 ps-2"> ({product?.numOfReviews}) </span>
                    </div>
                    <p className="card-text mt-2">${product?.price}</p>
                    <Link to={`/product/${product?._id}`} id="view_btn" className="btn btn-block">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
   </>
  )
}

export default ProductItem
