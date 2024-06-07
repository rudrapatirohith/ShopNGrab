import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'  // importing them from Redux Toolkit's RTK Query package for React.

export const orderApi = createApi({ //Creates an API slice using createApi and exports it as productApi.
    reducerPath: "orderApi",    // Sets the reducerPath to "productApi", which is the key in the Redux store where the API slice's state will be stored.
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/shopngrab" }),  // Defines the baseQuery using fetchBaseQuery with the base URL of the API.
    endpoints: (builder) => ({  // Defines the endpoints using a builder function to create API endpoints(get etc).
        createNewOrder: builder.mutation({  
            query: (body) => {
                return {
                    url: "/order/new",
                    method: 'POST',
                    body,
                }
            },
        }),
        stripeCheckoutSession: builder.mutation({  
            query: (body) => {
                return {
                    url: "/payment/checkout_session",
                    method: 'POST',
                    body,
                }
            },
        }),
        MyOrders: builder.query({  // Creates a query endpoint named MyOrders.
            query: () => `/profile/orders`,
        }),
    })
})

export const { useCreateNewOrderMutation, useStripeCheckoutSessionMutation,useMyOrdersQuery} = orderApi  // useCreateNewOrderMutation -> this is the hook that provides all the products wih this mutation