
import { configureStore } from "@reduxjs/toolkit";
import { userapi } from "./api/userapi";
import { userReducer } from "./reducer/userreducer";
import { productAPI } from "./api/productapi";
import { CartReducer } from "./reducer/cartreducer";
import { orderapi } from "./api/orderapi";
import { dashboardApi } from "./api/stats";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [userapi.reducerPath]: userapi.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderapi.reducerPath]: orderapi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [userReducer.name]: userReducer.reducer,
        [CartReducer.name]: CartReducer.reducer,
    },
    middleware: (mid) => [
        ...mid(),
        userapi.middleware,
        productAPI.middleware,
        orderapi.middleware,
        dashboardApi.middleware,
      ],
});

// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<typeof store.getState>;