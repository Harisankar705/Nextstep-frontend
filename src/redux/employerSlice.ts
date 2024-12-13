import { createSlice } from "@reduxjs/toolkit";
const initialState={
    _id:null,
    email:null,
    logo:null,
    isAuthenticated:false,
    companyName:null
}
const employerSlice=createSlice({
    name:'employer',
    initialState,
    reducers:{
        setEmployer:(state,action)=>{
            return {...state,...action.payload,isAuthenticated:true}
        },
        clearEmployer:()=>{
            return {...initialState,isAuthenticated:false}
        }
    }
})
export const{setEmployer,clearEmployer}=employerSlice.actions
export default employerSlice.reducer