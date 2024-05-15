import React, { useEffect } from 'react'
import PageTitle from './layouts/PageTitle'
import { useGetProductsQuery } from '../redux/api/productsApi'
import ProductItem from './product/ProductItem';
import Loader from './layouts/Loader';
import toast from 'react-hot-toast';
import CustomPagination from './layouts/CustomPagination.jsx';
import { useSearchParams } from 'react-router-dom';
import Filters from './layouts/Filters.jsx';


const Home=()=> {

  let [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;

  const keyword = searchParams.get("keyword") || "";

  const min = searchParams.get("min");

  const max = searchParams.get("max");

  const category = searchParams.get("category");

  const ratings = searchParams.get("ratings");

  const params = {page,keyword};
  
  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
 ratings !== null && (params.ratings = ratings);
  console.log(params);
  const {data , isLoading, error,isError} = useGetProductsQuery(params);

  useEffect(()=>{
    if(isError){
      toast.error(error?.data?.message);
    }
  },[isError]);


  const columnSize = keyword ? 4 : 3;

    if(isLoading) return <Loader />;
  return (
    <>
    <PageTitle title={"All You Needs are Here"}/>
      <div className="row">
        {keyword && (
          <div className="col-6 col-md-3 mt-5"> 
          <Filters />
          </div>
        )}
        <div className={keyword ? "col-6 col-md-9" : "col-6 col-md-12"}>
          <h1 id="products_heading" className="text-secondary">
           {keyword ? `${data?.products?.length} Products found with Keyword: ${keyword}` : "Latest Products"}
            </h1>

          <section id="products" className="mt-5">
            <div className="row">
              {data?.products?.map((product)=>(
                <ProductItem product={product} columnSize={columnSize} />
              ))}
              
            </div>
          </section>

          <CustomPagination 
          resPerPage={data?.resPerPage} 
          filteredProductsCount={data?.filterProductsCount}
          />
          
        </div>
      </div>
      </>
  )
}

export default Home
