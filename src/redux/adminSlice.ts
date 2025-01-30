import { createSlice } from "@reduxjs/toolkit";
const initialState={
    _id:null,
    email:null,
}
const adminSlice=createSlice({
    name:'admin',
    initialState,
    reducers:{
        setAdmin:(state,action)=>{
            return {...state,...action.payload,isAuthenticated:true}
        },
        clearAdmin:()=>{
            return {...initialState,isAuthenticated:false}
        }
    }
})
export const{setAdmin,clearAdmin}=adminSlice.actions
export default adminSlice.reducer