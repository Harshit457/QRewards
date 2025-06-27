import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser'; 
import { connectDB } from './lib/db.js'; 
import promotionroutes from "./routes/promotion.route.js";
import recentActivityRoutes from "./routes/recentActivity.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://qreward.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Credentials','true');
  next();
})
app.use(cookieParser()); // Add this line to use cookie-parser middleware
app.use("/api/auth", authRoutes);
app.use("/api/promotions", promotionroutes); // Add this line to use the promotion routes
app.use("/api/recent-activities",recentActivityRoutes); // Add this line to use the recent activity routes
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

