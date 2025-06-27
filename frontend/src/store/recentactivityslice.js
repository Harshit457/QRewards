// src/store/recentActivitySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../lib/axios';

// Adjust this if your base URL is set elsewhere
const API_BASE = '/recent-activities';

// 1. Fetch activities for a user
export const fetchRecentActivities = createAsyncThunk(
  'recentActivity/fetch',
  async (userId, { rejectWithValue }) => {
    console.log('Fetching recent activities for user:', userId);
    try {
      const response = await axiosInstance.get(`${API_BASE}/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 2. Optional: Add a new activity
export const addRecentActivity = createAsyncThunk(
  'recentActivity/add',
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_BASE, activityData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const getRecentActivitiesByCompany = createAsyncThunk(
  'recentActivity/company',
  async (userId ,{ rejectWithValue }) => { 
    try{
      console.log('Fetching recent activities for company:', userId);
      const response = await axiosInstance.get(`${API_BASE}/company`);
      return response.data;
    }catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const recentActivitySlice = createSlice({
  name: 'recentActivity',
  initialState: {
    activities: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRecentActivityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all activities
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add a new activity
      .addCase(addRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities.unshift(action.payload);
      })
      .addCase(addRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch company-specific activities
      .addCase(getRecentActivitiesByCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentActivitiesByCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(getRecentActivitiesByCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRecentActivityError } = recentActivitySlice.actions;
export default recentActivitySlice.reducer;