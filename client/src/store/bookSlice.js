import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBook = createAsyncThunk('book/fetchBook', async () => {
    const response = await axios({
        method: 'GET',
        // url: 'http://localhost:3001/books',
        url: 'https://server.littleatlas.cloud/books',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    });

    localStorage.setItem('recommended', JSON.stringify(response.data.result));

    return response.data.books;
});

const bookSlice = createSlice({
    name: 'book',
    initialState: {
        items: [],
        error: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBook.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBook.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchBook.rejected, (state, action) => {
                console.log(action.error.message, 'action.error.message');
                
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

const bookReducer = bookSlice.reducer;
export default bookReducer;