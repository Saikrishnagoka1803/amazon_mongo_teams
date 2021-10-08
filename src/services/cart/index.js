import express from "express";
import productModel from "../products/schema.js";
import CartModel from "./schema.js";
import createHttpError from "http-errors";

const cartRoutes = express.Router();

cartRoutes.post("/:userId/addToCart", async (req, res, next) => {
  try {
    const purchasedProduct = await productModel.findById(req.body.id);
    if (purchasedProduct) {
      const isProductThere = await CartModel.findOne({
        userId: req.params.userId,
        status: "active",
        "products.id": purchasedProduct._id
      });

      if (isProductThere) {
        const cart = await CartModel.findOneAndUpdate(
          { userId: req.params.userId, status: "active" },
          {
            $inc: { "products.$.quantity": req.body.quantity }
          },
          {
            new: true
          }
        );
        res.send(cart);
      } else {
        const productToInsert = {
          ...purchasedProduct.toObject(),
          quantity: req.body.quantity
        };

        const cart = await CartModel.findOneAndUpdate(
          { userId: req.params.userId, status: "active" },
          {
            $push: { products: productToInsert }
          },
          {
            new: true,
            upsert: true
          }
        );
        res.send(cart);
      }
    } else {
      next(
        createHttpError(404, `product with id ${req.body.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default cartRoutes;
