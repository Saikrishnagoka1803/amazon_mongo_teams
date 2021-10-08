import express from "express"
import productModel from "../products/schema.js"
import CartModel from "./schema.js"
import createHttpError from "http-errors"

const cartRoutes = express.Router();

cartRoutes.post("/:productId/addToCart", async (req, res, next) => {
  try {
    //const productId = req.body.productId

    const purchasedproduct = await productModel.findById(bookId)

    if (purchasedproduct) {
      const isproductThere = await CartModel.findOne({ productId: req.params.productId, status: "active" })

      if (isproductThere) {
        const cart = await CartModel.findOneAndUpdate(
          { productId: req.params.productId, status: "active" },
          {
            $inc: { "products.$.quantity": req.body.quantity }, // products[index].quantity += req.body.quantity
          },
          {
            new: true,
          }
        )
        res.send(cart)
      } else {
        const productToInsert = { ...purchasedproduct.toObject(), quantity: req.body.quantity }

        const cart = await CartModel.findOneAndUpdate(
          { productId: req.params.productId, status: "active" },
          {
            $push: { products: productToInsert },
          },
          {
            new: true,
            upsert: true,
          }
        )
        res.send(cart)
      }
    } else {
      next(createHttpError(404, `product with id ${productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default cartRoutes;