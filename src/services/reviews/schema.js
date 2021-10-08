import mongoose from "mongoose";

const { Schema } = mongoose;

export const reviewsSchema = new Schema(
  {
    text: { type: String, required: true },
    user_name: { type: String, required: true }
  },
  {
    timestamps: true
  }
);
