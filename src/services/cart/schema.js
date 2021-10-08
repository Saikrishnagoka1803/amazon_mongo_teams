import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  status: { type: String, enum: ["active", "paid"], default: "active" },
  products: [{ id: String, name: String, price: Number, quantity: Number }]
});

export default model("Cart", cartSchema);
