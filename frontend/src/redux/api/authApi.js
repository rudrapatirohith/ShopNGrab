import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'  // importing them from Redux Toolkit's RTK Query package for React.
import { userApi } from './userApi';

export const authApi = createApi({ 
    reducerPath: "authAPi",     
    baseQuery: fetchBaseQuery({baseUrl:"http://localhost:3000/api/shopngrab"}),  // Defines the baseQuery using fetchBaseQuery with the base URL of the API.
    endpoints: (builder) => ({  // Defines the endpoints using a builder function to create API endpoints(get etc).
        
        // Defines the endpoints using a builder function to create API endpoints(get etc).
        login: builder.mutation({  // for post req we use mutation
           query(body) {
            return {
            url : '/login',
            method : 'POST',
            body,
           }
        },
        async onQueryStarted(args, {dispatch,queryFulfilled}){
            try {
                await queryFulfilled;
                await dispatch(userApi.endpoints.getMe.initiate(null));
            } catch (error) {
                console.log(error);
            }
        }
        }),
        signUp: builder.mutation({
            query(body){
                return{
                    url: "/signin",
                    method: "POST",
                    body,
                }
            },
            async onQueryStarted(args, {dispatch,queryFulfilled}){
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getMe.initiate(null));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        logout: builder.query({
            query:()=>`/logout`
        })
    })
})

export const {useLoginMutation,useSignUpMutation,useLazyLogoutQuery} = authApi;  