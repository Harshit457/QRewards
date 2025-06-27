// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authuserslice.js";
import promotionReducer from "./promotionslice.js";
import activitiesReducer from "./recentactivityslice.js"; // Assuming you have a recent activity slice
const store = configureStore({
  reducer: {
    auth: authReducer,
    promotion: promotionReducer,
    activities: activitiesReducer, // Add this line to include the recent activity slice
  },
});

export default store;
