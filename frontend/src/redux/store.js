import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi.js"; // Imports the productApi from the productsApi.js file.

export const store= configureStore({   //Exports the Redux store named store configured with configureStore
    reducer: {[productApi.reducerPath]:productApi.reducer,},  // Sets the reducer field in the store configuration, using the reducerPath and reducer from productApi
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([productApi.middleware]),  // Configures the middleware by concatenating the default middleware with productApi.middleware.
})