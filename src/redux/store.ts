import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import storage from 'redux-persist/lib/storage'
import {persistStore,persistReducer} from 'redux-persist'
const persistConfig={
    key:'root',
    storage
}
const persistedUserReducer =persistReducer(persistConfig,userReducer)
export const store = configureStore({
    reducer: {
        user: persistedUserReducer  
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:{
                ignoredActions:['persist/PERSIST','persist/REHYDRATE']
            }
        })
    }
)
export const persistor=persistStore(store)
export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch