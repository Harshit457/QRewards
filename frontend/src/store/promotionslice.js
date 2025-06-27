import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";


// BASE URL
const API_URL = "/promotions";

// Async Thunks
export const fetchAllPromotions = createAsyncThunk(
  "promotion/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${API_URL}`);
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchMyPromotions = createAsyncThunk(
  "promotion/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${API_URL}/my`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchPromotionById = createAsyncThunk(
  "promotion/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const createPromotion = createAsyncThunk(
  "promotion/create",
  async (promotionData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${API_URL}`, promotionData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updatePromotion = createAsyncThunk(
  "promotion/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`${API_URL}/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const deletePromotion = createAsyncThunk(
  "promotion/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Initial State
const initialState = {
  promotions: [],
  selectedPromotion: null,
  loading: false,
  error: null,
};

// Slice
const promotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    clearSelectedPromotion: (state) => {
      state.selectedPromotion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllPromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchAllPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My
      .addCase(fetchMyPromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchMyPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchPromotionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPromotionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPromotion = action.payload;
      })
      .addCase(fetchPromotionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createPromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions.push(action.payload);
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updatePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = state.promotions.map((p) =>
          p.promotionId === action.payload.promotionId ? action.payload : p
        );
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deletePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = state.promotions.filter(
          (p) => p.promotionId !== action.payload
        );
      })
      .addCase(deletePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedPromotion } = promotionSlice.actions;
export default promotionSlice.reducer;
