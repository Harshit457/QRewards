import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, default: 14 } // Start from 14
});

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;
