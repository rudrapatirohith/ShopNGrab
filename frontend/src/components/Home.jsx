import React, { useEffect, useState } from 'react';
import PageTitle from './layouts/PageTitle';
import { useGetProductsQuery } from '../redux/api/productsApi';
import ProductItem from './product/ProductItem';
import Loader from './layouts/Loader';
import toast from 'react-hot-toast';
import CustomPagination from './layouts/CustomPagination.jsx';
import { useSearchParams } from 'react-router-dom';
import Filters from './layouts/Filters.jsx';
import useAnimatedText from './hooks/AnimatedText.jsx';


const Home = () => {
  let [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");

  const params = { page, keyword };

  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);
  console.log(params);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError,error]);

  const columnSize = keyword ? 4 : 3;

  const titleText = keyword ? `${data?.products?.length} Products found with Keyword: ${keyword}` : `Latest Products`;
  const animatedTitle = useAnimatedText(titleText);

  const[currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = ["/images/poster1.jpg",
    "/images/poster2.jpg"];

    useEffect(() => {
      // Set up an interval to change the image every 2 seconds
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
  
      // Clear the interval on component unmount
      return () => clearInterval(interval);
    }, [images.length]);

  
  if (isLoading) return <Loader />;

  return (
    <>
      <PageTitle title={"All You Need Is Here"} />
      <div className="row">
        {keyword && (
          <div className="col-6 col-md-3 mt-3">
            <Filters />
          </div>
        )}
        <div className={keyword ? "col-6 col-md-9" : "col-12"}>
        <div className="image-container" style={{ textAlign: 'center', width: '100%', marginBottom: '20px', height:"400px" }}>
            <img src={images[currentImageIndex]} alt="Banner" style={{borderRadius: '15px', height: "100%", width:"100%" }} />
          </div>
          <h1 id="products_heading" className="text-secondary animated-text">
            {animatedTitle.split('').map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.03}s` }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>


          <section id="products" className="mt-3">
            <div className="row">
              {data?.products?.map((product) => (
                <ProductItem key={product._id} product={product} columnSize={columnSize} />
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
  );
}

export default Home;
