// controllers/promotionController.js
import Promotion from "../models/promotion.model.js";
import Counter from "../models/counter.js";
import User from "../models/user.model.js";
import RecentActivity from "../models/RecentActivity.js";
// CREATE Promotion (Only for company role)
export const createPromotion = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    const newPromotion = await Promotion.create({
      ...req.body,
      company: req.user._id,
    });

    res.status(201).json(newPromotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ - Get all promotions (admin only or for testing)
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .populate({
        path: "company",
        select: "fullName", // Only return name and email of the company
      });

    res.status(200).json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// READ - Get all promotions for a particular company
export const getPromotionsByCompany = async (req, res) => {
  try {
    const promotions = await Promotion.find({ company: req.user._id });
    res.status(200).json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ - Get single promotion
export const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findOne({
      promotionId: req.params.id,
    }).populate("company", "name email");

    if (!promotion) return res.status(404).json({ message: "Not found" });

    res.status(200).json(promotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE Promotion (only owner company can update)
export const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findOneAndUpdate(
      { promotionId: req.params.id },
      req.body,
      { new: true }
    );

    if (!promotion) return res.status(404).json({ message: "Not found or unauthorized" });

    res.status(200).json(promotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update winningqr code
export const updateWinningQrCode = async (req, res) => {
  try {
    const promotion = await Promotion.findOneAndUpdate(
      { promotionId: req.params.id },
      { winningQrCode: req.body.winningQrCode },
      { new: true }
    );

    if (!promotion) return res.status(404).json({ message: "Not found or unauthorized" });

    res.status(200).json(promotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE Promotion (only owner company can delete)
export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findOneAndDelete({
      promotionId: req.params.id,
      company: req.user._id,
    });

    if (!promotion) return res.status(404).json({ message: "Not found or unauthorized" });

    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getrecentactivitybycompany = async (req, res) => {
  try {
    const userId = req.user._id;

    const activities = await RecentActivity.find({ companyid: userId })
      // removed .sort({ activityTime: -1 }) ✅
      .populate("userId", "fullName email")
      .populate("promotionId", "title");

    const formatted = activities.map((activity) => {
      const base = {
        id: activity._id,
        type: activity.type,
        promotion: activity.promotionId?.title || "Unknown Promotion",
        timestamp: activity.activityTime,
      };

      if (activity.type === "scan") {
        return {
          ...base,
          qrId: activity.qrId || "Unknown QR",
          result: activity.result || "No Win",
        };
      } else {
        return {
          ...base,
          name: activity.userId?.fullName || "Unknown User",
          action: activity.action || "did something",
        };
      }
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

