import express from "express";
import createHttpError from "http-errors";
import ProductModel from "../products/schema.js";

reviewsRouter = express.Router();

reviewsRouter.route(":productId/reviews").post(async (req, res, next) => {
  try {
    const targetProduct = await ProductModel.FindById(req.params.productId);
    if (targetProduct) {
      const newComment = await ProductModel.FindByIdAndUpdate(
        req.params.productId,
        { $push: { reviews: req.body } },
        { new: true }
      );
      res.send(newComment);
    } else {
      next(
        createHttpError(
          404,
          `Product with the id of ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
reviewsRouter
  .route(":productId/reviews/:reviewId")
  .put(async (req, res, next) => {
    try {
      const targetProduct = await ProductModel.FindById(req.params.blogPostId);
      if (targetProduct) {
        const index = targetProduct.reviews.findIndex(
          (r) => r._id.toString() === req.params.reviewId
        );
        if (index !== -1) {
          targetProduct.comments[index] = {
            ...targetProduct.reviews[index].toObject(),
            ...req.body
          };
          await targetProduct.save();
          res.send(targetProduct);
        } else {
          next(
            createHttpError(
              404,
              `Review with the id of ${req.params.reviewId} not found!`
            )
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `Product with the id of ${req.params.productId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const targetProduct = await ProductModel.FindById(productId);
      if (targetProduct) {
        await ProductModel.findByIdAndUpdate(
          req.params.productId,
          { $pull: { reviews: { _id: req.params.reviewId } } },
          { new: true }
        );
        res.staus(204).send();
      } else {
        next(
          createHttpError(
            404,
            `Product with the id of ${req.params.productId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  });

export default reviewsRouter;
