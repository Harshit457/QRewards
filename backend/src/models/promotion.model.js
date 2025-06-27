import mongoose from "mongoose";
import Counter from "./counter.js";
const promotionSchema = new mongoose.Schema(
  {
    promotionId: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    totalBudget: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Expired",
    },
    totalQRCodes: {
      type: Number,
      default: 0,
    },
    scannedQRCodes: {
      type: Number,
      default: 0,
    },
    numberofPrizes: {
      type: Number,
      default: 0,
    },
    txhash: {
      type: String,
      required: true,
    },
    
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
promotionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "promotionId" },
      { $inc: { value: 2 } }, // Increment by 2 to keep only odd numbers
      { new: true, upsert: true }
    );
    this.promotionId = counter.value;
  }
  next();
});

const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;
