import express from "express";
import {
  createRecentActivity,
  getRecentActivitiesByUser,
  updateRecentActivity,
  deleteRecentActivity,
} from "../controllers/recentActivity.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js"; // assumed auth middleware
import { getrecentactivitybycompany } from "../controllers/promotion.controller.js"; // assumed model import
const router = express.Router();

// Create a new recent activity (only for logged-in user)
router.post("/", protectRoute, createRecentActivity);

// Get all recent activities for logged-in user
router.get("/", protectRoute, getRecentActivitiesByUser);

// Update a specific recent activity (only for the user who created it)
router.put("/:id", protectRoute, updateRecentActivity);

// Delete a specific recent activity (only for the user who created it)
router.delete("/:id", protectRoute, deleteRecentActivity);

// Get recent activities by company (only for company role)
router.get("/company", protectRoute, getrecentactivitybycompany);

export default router;
