import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userreducertype } from "../../types/reducers-types";
import { user } from "../../types/types";
const initialState:userreducertype= {
user:null,
loading:true,
};
export const userReducer= createSlice({
    name:"userReducer",
    initialState,
    reducers:{
        userexist:(state,action:PayloadAction<user>)=>{
            state.loading=false;
            state.user=action.payload;
        },
        usernotexist:(state)=>{
            state.loading=false;
            state.user=null;
        }
    }
})
export const {userexist,usernotexist}= userReducer.actions;