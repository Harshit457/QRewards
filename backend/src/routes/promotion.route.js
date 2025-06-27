import express from "express";
import {
  createPromotion,
  getAllPromotions,
  getPromotionsByCompany,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} from "../controllers/promotion.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js"; // assumed auth middleware

const router = express.Router();

// Create a promotion (only for company)
router.post("/", protectRoute, createPromotion);

// Get all promotions (admin only, or for testing)
router.get("/", protectRoute, getAllPromotions);

// Get all promotions for logged-in company
router.get("/my", protectRoute, getPromotionsByCompany);

// Get a single promotion by promotionId
router.get("/:id", protectRoute, getPromotionById);

// Update a promotion by promotionId (only company that created it)
router.put("/:id", protectRoute, updatePromotion);

// Delete a promotion by promotionId (only company that created it)
router.delete("/:id", protectRoute, deletePromotion);

export default router;
