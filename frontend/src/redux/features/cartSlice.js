import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem('cartItems')? JSON.parse(localStorage.getItem('cartItems')):[],
};

export const cartSlice = createSlice({
    initialState,
    name: "cartSlice",
    reducers: {
        setCartItem : ( state,action) =>{
            const item  =action.payload;
            
            const isItemExist = state.cartItems.find((i)=>i.product===item.product)

            if(isItemExist){
                state.cartItems=state.cartItems.map((i)=>i.product===isItemExist.product ? item : i)
            }
            else{
                state.cartItems=[...state.cartItems,item]
            }
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems))
        },
        removeCartItem:(state,action)=>{
            state.cartItems= state?.cartItems?.filter(
                (i)=>i.product !== action.payload // we check if the item if we click it it will be in action payload so it will create new array which doesnt have product id matching to it 
            )
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems)) // we send that new array to localstorage now

        }
    }
});

export default cartSlice.reducer ;

export const {setCartItem,removeCartItem} = cartSlice.actions;