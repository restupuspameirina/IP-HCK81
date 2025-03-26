import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import bookReducer from "./bookSlice";
import orderReducer from "./orderSlice";
import genreReducer from "./genreSlice";

const store = configureStore({
    reducer: {
        cart: cartReducer,
        book: bookReducer,
        order: orderReducer,
        genre: genreReducer,
    },
});


export default store;