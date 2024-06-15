import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'  // importing them from Redux Toolkit's RTK Query package for React.
import { setUserAuthenticated, setIsLoading, setUser } from '../features/userSlice';


export const userApi = createApi({ 
    reducerPath: "userApi",     
    baseQuery: fetchBaseQuery({baseUrl:"http://localhost:3000/api/shopngrab"}),  // Defines the baseQuery using fetchBaseQuery with the base URL of the API.
    tagTypes: ["User",'AdminUsers','AdminUser'],
    endpoints: (builder) => ({  // Defines the endpoints using a builder function to create API endpoints(get etc).
        getMe: builder.query({  // for post req we use mutation
           query: () => `/profile`,
           transformResponse:(result)=>result.user,
            async onQueryStarted(args, {dispatch,queryFulfilled}){
                try{
                    const {data} = await queryFulfilled;
                    dispatch(setUser(data));
                    dispatch(setUserAuthenticated(true));
                    dispatch(setIsLoading(false))
                }
                catch(error){
                    dispatch(setIsLoading(false))
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
        uploadAvatar: builder.mutation({
            query(body){
                return{
                    url:"/profile/upload_avatar",
                    method:"PUT",
                    body,
                };
            },
            invalidatesTags: ["User"],
        }),
        updatePassword:builder.mutation({
            query(body){
                return{
                    url : "/password/update",
                    method:"PUT",
                    body,
                };
            }
        }),
        forgotPassword: builder.mutation({
            query(body){
                return{
                    url: "/password/forgot",
                    method: "POST",
                    body,
                }
            }
        }),
        resetPassword: builder.mutation({
            query({token,body}){
                return{
                    url:`/password/reset/${token}`,
                    method:"PUT",
                    body,
                }
            }
        }),
        getAdminUsers: builder.query({  // Creates a query endpoint named MyOrders.
            query: () => `/admin/users`,
            providesTags:['AdminUsers']
        }),
        getUserDetails: builder.query({  // Creates a query endpoint named MyOrders.
            query: (id) => `/admin/users/${id}`,
            providesTags:['AdminUser']
        }),
        updateUser: builder.mutation({  
            query: ({id,body}) => {
                return {
                    url: `admin/users/${id}`,
                    method: 'PUT',
                    body,
                }
            },
            invalidatesTags: ['AdminUsers']
        }),
        deleteUser: builder.mutation({  
            query: (id) => {
                return {
                    url: `admin/users/${id}`,
                    method: 'DELETE',
                    }
            },
            invalidatesTags: ['AdminUsers']
        }),
        
    })
})


export const {useGetMeQuery,useUpdateProfileMutation,useUploadAvatarMutation,useUpdatePasswordMutation,useForgotPasswordMutation,useResetPasswordMutation,useGetAdminUsersQuery,useUpdateUserMutation,useGetUserDetailsQuery,useDeleteUserMutation} = userApi;  