import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'  // importing them from Redux Toolkit's RTK Query package for React.

export const orderApi = createApi({ //Creates an API slice using createApi and exports it as productApi.
    reducerPath: "orderApi",    // Sets the reducerPath to "productApi", which is the key in the Redux store where the API slice's state will be stored.
    baseQuery: fetchBaseQuery({ baseUrl: "/api/shopngrab" }),  // Defines the baseQuery using fetchBaseQuery with the base URL of the API.
    tagTypes: ['Order','AdminOrders'],
    endpoints: (builder) => ({  // Defines the endpoints using a builder function to create API endpoints(get etc).
        createNewOrder: builder.mutation({  
            query: (body) => {
                return {
                    url: "/orders/new",
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
        myOrders: builder.query({  // Creates a query endpoint named MyOrders.
            query: () => `/profile/orders`,
        }),
        orderDetails: builder.query({  // Creates a query endpoint named MyOrders.
            query: (id) => `/orders/${id}`,
            providesTags: ['Order']
        }),
        getAdminOrders: builder.query({  // Creates a query endpoint named MyOrders.
            query: () => `/admin/orders`,
            providesTags:['AdminOrders']
        }),
        getDashboardSales: builder.query({  // Creates a query endpoint named MyOrders. // we us elazy because it will only call onve we click on fetch button
            query: ({startDate,endDate}) => `/admin/get_sales/?startDate=${startDate}&endDate=${endDate}`,
        }),
        updateOrder: builder.mutation({  
            query: ({id,body}) => {
                return {
                    url: `admin/orders/${id}`,
                    method: 'PUT',
                    body,
                }
            },
            invalidatesTags: ['Order']
        }),
        deleteOrder: builder.mutation({  
            query(id){
                return {
                    url: `admin/orders/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['AdminOrders']
        }),
    })
})

export const { useCreateNewOrderMutation, useStripeCheckoutSessionMutation,useMyOrdersQuery,useOrderDetailsQuery,useLazyGetDashboardSalesQuery,useGetAdminOrdersQuery,useUpdateOrderMutation,useDeleteOrderMutation} = orderApi  // useCreateNewOrderMutation -> this is the hook that provides all the products wih this mutation