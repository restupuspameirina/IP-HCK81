import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        // changed: false,
    },
    reducers: {
        // replaceCart(state, action) {
        //     state.totalQuantity = action.payload.totalQuantity;
        //     state.items = action.payload.items;
        // },
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.BookId === newItem.BookId);
            // state.totalQuantity++;
            // state.changed = true;

            if (!existingItem) {
                state.items.push({
                   BookId: newItem.BookId,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    name: newItem.name,
                    unitPrice: newItem.price,
                });

            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
                existingItem.unitPrice = existingItem.totalPrice;
            }

            state.totalQuantity++;
            state.totalPrice = state.totalPrice + newItem.price;

        },
        removeItemFromCart(state, action) {
            constBookId = action.payload;
            const existingItem = state.items.find((item) => item.BookId ===BookId);
            // state.totalQuantity--;
            // state.changed = true;

            if (existingItem.quantity === 1) {
                state.items = state.items.filter((item) => item.BookId !==BookId);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
                existingItem.unitPrice = existingItem.totalPrice;
            }

            state.totalQuantity--;
            state.totalPrice = state.totalPrice - existingItem.price;
        },
    },
});

export const { addItemToCart, removeItemFromCart } = cartSlice.actions;

const cartReducer = cartSlice.reducer;
export default cartReducer;