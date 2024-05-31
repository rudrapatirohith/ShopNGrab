import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'  // importing them from Redux Toolkit's RTK Query package for React.

export const productApi = createApi({ //Creates an API slice using createApi and exports it as productApi.
    reducerPath: "productApi",    // Sets the reducerPath to "productApi", which is the key in the Redux store where the API slice's state will be stored.
    baseQuery: fetchBaseQuery({baseUrl:"http://localhost:3000/api/shopngrab"}),  // Defines the baseQuery using fetchBaseQuery with the base URL of the API.
    endpoints: (builder) => ({  // Defines the endpoints using a builder function to create API endpoints(get etc).
        getProducts: builder.query({  // Creates a query endpoint named getProducts.
            query: (params) => ({
                url: "/products",
                params: { 
                    page: params?.page,
                    keyword: params?.keyword,
                    "price[gte]": params.min,
                    "price[lte]": params.max,
                    category: params?.category,
                    "ratings[gte]":params?.ratings,
                }}),  // Specifies the query function that returns the endpoint path for fetching products.
        }),
        // Defines the endpoints using a builder function to create API endpoints(get etc).
        getProductDetails: builder.query({  // Creates a query endpoint named getProducts.
            query: (id) => `/products/${id}`,  // Specifies the query function that returns the endpoint path for fetching products.
        }),
    })
})

export const {useGetProductsQuery, useGetProductDetailsQuery} = productApi  // useGetProductsQuery -> this is the hook that provides all the products wih this mutation