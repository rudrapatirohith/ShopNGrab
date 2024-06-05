import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi.js"; // Imports the productApi from the productsApi.js file.
import { authApi } from "./api/authApi.js";
import { userApi } from "./api/userApi.js";
import userReducer from "./features/userSlice.js";
import cartReducer from "./features/cartSlice.js"
import {orderApi} from "./api/orderApi.js"

export const store= configureStore({   //Exports the Redux store named store configured with configureStore
    reducer: {
        auth: userReducer,
        cart: cartReducer,
        [productApi.reducerPath]:productApi.reducer,
        [authApi.reducerPath]:authApi.reducer,
        [userApi.reducerPath]:userApi.reducer,
        [orderApi.reducerPath]:orderApi.reducer,
    },  // Sets the reducer field in the store configuration, using the reducerPath and reducer from productApi
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([productApi.middleware,authApi.middleware,userApi.middleware,orderApi.middleware]),  // Configures the middleware by concatenating the default middleware with productApi.middleware.
}) 