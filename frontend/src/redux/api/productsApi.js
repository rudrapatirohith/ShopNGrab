import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'  // importing them from Redux Toolkit's RTK Query package for React.

export const productApi = createApi({ //Creates an API slice using createApi and exports it as productApi.
    reducerPath: "productApi",    // Sets the reducerPath to "productApi", which is the key in the Redux store where the API slice's state will be stored.
    baseQuery: fetchBaseQuery({baseUrl:"http://localhost:3000/api/shopngrab"}),  // Defines the baseQuery using fetchBaseQuery with the base URL of the API.
    tagTypes: ["Product","AdminProducts"],
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
            providesTags:["Product"]
        }),
        canUserReview: builder.query({  // Creates a query endpoint named getProducts.
            query: (productId) => `/can_review/?productId=${productId}`,  // Specifies the query function that returns the endpoint path for fetching products.
        }),  
        getAdminProducts: builder.query({  // Creates a query endpoint named getProducts.
            query: () => `/admin/products`,  // Specifies the query function that returns the endpoint path for fetching products.
            providesTags:["AdminProducts"]
        }),
        submitReview: builder.mutation({  
            query(body){
                return {
                    url: "/reviews",
                    method: 'PUT',
                    body,
                }
            },
            invalidatesTags:["Product"]
        }),
        createProduct : builder.mutation({  
            query(body){
                return {
                    url: "/admin/products",
                    method: 'POST',
                    body,
                }
            },
        invalidatesTags: ["AdminProducts"],
        }),
        updateProduct : builder.mutation({  
            query({id,body}){
                return {
                    url: `/admin/products/${id}`,
                    method: 'PUT',
                    body,
                }
            },
        invalidatesTags: ["AdminProducts","Product"],
        }),
        uploadProductImages : builder.mutation({  
            query({id,body}){
                return {
                    url: `/admin/products/${id}/upload_images`,
                    method: 'PUT',
                    body,
                }
            },
        invalidatesTags: ["Product"],
        }),
        deleteProductImage : builder.mutation({  
            query({id,body}){
                return {
                    url: `/admin/products/${id}/delete_image`,
                    method: 'PUT',
                    body,
                }
            },
        invalidatesTags: ["Product"],
        }),
    })
})

export const {useGetProductsQuery, useGetProductDetailsQuery,useSubmitReviewMutation,useCanUserReviewQuery,useGetAdminProductsQuery,useCreateProductMutation,useUpdateProductMutation,useUploadProductImagesMutation,useDeleteProductImageMutation} = productApi  // useGetProductsQuery -> this is the hook that provides all the products wih this mutation