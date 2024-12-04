import {createSlice} from '@reduxjs/toolkit'
const initialState={
    _id:null,
    userName:null,
    email:null,
    profilePicture:null,
    isAuthenticated:false
}
const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            return {...state,...action.payload,isAuthenticated:true}
        },
        clearUser:()=>{
            return {...initialState,isAuthenticated:false}
        }
    }
})
export const {setUser,clearUser}=userSlice.actions
export default userSlice.reducer
