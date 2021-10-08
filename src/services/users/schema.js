import mongoose from "mongoose"

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    carts:[{type:Schema.Types.ObjectId, ref:"Cart"}]
  },
  {
    timestamps: true, 
  }
)

export default model("User", userSchema) 