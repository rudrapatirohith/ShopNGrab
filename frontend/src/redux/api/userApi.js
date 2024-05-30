import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'  // importing them from Redux Toolkit's RTK Query package for React.
import { setIsAuthenticated, setUser } from '../features/userSlice';

export const userApi = createApi({ 
    reducerPath: "userApi",     
    baseQuery: fetchBaseQuery({baseUrl:"http://localhost:3000/api/shopngrab"}),  // Defines the baseQuery using fetchBaseQuery with the base URL of the API.
    tagTypes: ["User"],
    endpoints: (builder) => ({  // Defines the endpoints using a builder function to create API endpoints(get etc).
        getMe: builder.query({  // for post req we use mutation
           query: () => `/profile`,
           transformResponse:(result)=>result.user,
            async onQueryStarted(args, {dispatch,queryFulfilled}){
                try{
                    const {data} = await queryFulfilled;
                    dispatch(setUser(data));
                    dispatch(setIsAuthenticated(true));
                }
                catch(error){
                    console.log(error);
                }
            },
            providesTags: ["User"],
        }),
        updateProfile: builder.mutation({
            query(body){
                return {
                    url: "/profile/update",
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: ["User"],
        }),
        
    })
})


export const {useGetMeQuery,useUpdateProfileMutation} = userApi;  