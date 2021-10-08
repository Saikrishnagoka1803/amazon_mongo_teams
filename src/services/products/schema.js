import mongoose from "mongoose"
import reviewsSchema from "../reviews/schema.js"

const { Schema, model } = mongoose

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ["cameras", "headphones", "laptops", "monitors", "smartphones"]},
    reviews: { default: [], type: [reviewsSchema] }
},
    { timestamps: true }
)

export default model("Product", productSchema)