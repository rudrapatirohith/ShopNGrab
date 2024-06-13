import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    userAuthenticated: false,
    loading: true,
};

export const userSlice = createSlice({
    initialState,
    name: "userSlice",
    reducers: {
        setUser(state,action){
            state.user = action.payload;
        },
        setUserAuthenticated(state,action){
            state.userAuthenticated = action.payload;
        },
        setIsLoading(state,action){
            state.loading= action.payload;
        }
    }
});

export default userSlice.reducer ;

export const {setUser,setUserAuthenticated,setIsLoading} = userSlice.actions;