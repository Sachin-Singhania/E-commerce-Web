import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cartitems, cartreducertype, shippingtype } from "../../types/reducers-types";
// import { productreducertype } from "../../types/reducers-types";
// import { Product } from "../../types/types";
const initialState:cartreducertype= {
    cartitems:[],
    discount:0,
    total: 0,
    shippingcharge  : 0,
    shippingInfo :{
        address:"",
        city:"",
        country:"",
        pincode:"",
        state:""
    },
    subtotal:0,
    tax:0,
loading:true,
};
export const CartReducer= createSlice({
    name:"CartReducer",
    initialState,
    reducers:{
        addToCart:(state , action:PayloadAction<cartitems>) =>{
            state.loading= true;
            const index = state.cartitems.findIndex(item=> item.productid ===action.payload.productid);
            if (index !== -1) state.cartitems[index] = action.payload;
           else{
            state.cartitems.push (action.payload);
            state.loading= false;
        }},
        removeFromCart:(state ,action:PayloadAction<string>)=>{
            state.loading= true;
            state.cartitems=state.cartitems.filter(i=>i.productid!= action.payload);
            state.loading= false;
        },
        calculateprice: (state) =>{
            const subtotal=state.cartitems.reduce((acc,item ) => acc + item.quantity * item.price , 0 );
             state.subtotal= subtotal ; 
             state.tax=Math.round(subtotal * 0.18);
             state.shippingcharge= state.subtotal >1000 ? 200 : 0;
             state.total= state.subtotal+ state.tax + state.shippingcharge- state.discount;
        },
        applyDiscount:(state,action: PayloadAction<number>)=>{
            state.discount= action.payload;
        },
        saveshippinginfo: (state,action: PayloadAction<shippingtype>)=>{
            state.shippingInfo=action.payload;
        },
        resetcart: ()=> {initialState},
    }});
export const {addToCart,removeFromCart,calculateprice, applyDiscount,resetcart,saveshippinginfo}= CartReducer.actions;