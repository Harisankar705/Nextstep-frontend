import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import employerReducer from './employerSlice'
import adminReducer from './adminSlice'
import storage from 'redux-persist/lib/storage'
import {persistStore,persistReducer} from 'redux-persist'
const persistConfig={
    key:'root',
    storage
}
const persistedUserReducer =persistReducer(persistConfig,userReducer)
const persisitedEmployerReducer=persistReducer(persistConfig,employerReducer)
const persistedAdminReducer=persistReducer(persistConfig,adminReducer)
export const store = configureStore({
    reducer: {
        user: persistedUserReducer ,
        employer:persisitedEmployerReducer,
        admin:persistedAdminReducer
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