import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGenre = createAsyncThunk('genre/fetchGenre', async () => {
    const response = await axios({
        method: 'GET',
        // url: 'http://localhost:3001/genres',
        url: 'https://server.littleatlas.cloud/genres',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    });

    return response.data;
});

const genreSlice = createSlice({
    name: 'genre',
    initialState: {
        items: [],
        error: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenre.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGenre.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchGenre.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

const genreReducer = genreSlice.reducer;
export default genreReducer;