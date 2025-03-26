import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrder = createAsyncThunk('order/fetchOrder', async () => {
    const response = await axios({
        method: 'GET',
        // url: 'http://localhost:3001/orders',
        url: 'https://server.littleatlas.cloud/orders',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    });

    return response.data;
});

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        items: [],
        error: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

const orderReducer = orderSlice.reducer;
export default orderReducer;