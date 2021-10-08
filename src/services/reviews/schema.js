import mongoose from "mongoose";

const { Schema } = mongoose;

export const reviewsSchema = new Schema(
  {
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);
