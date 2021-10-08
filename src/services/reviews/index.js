import express from "express";
import createHttpError from "http-errors"

reviewsRouter = express.Router();

reviewsRouter.route(":productId/reviews").post(async (req, res, next) => {
  try {
    const targetProduct
    if (targetProduct){
        res.send()
    }else {
        next(createHttpError(404, `Product with the id of ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error);
  }
}).put(async (req, res, next) => {
    try {
      const targetProduct
      if (targetProduct){
          res.send()
      }else {
          next(createHttpError(404, `Product with the id of ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error);
    }
  }).delete(async (req, res, next) => {
    try {
      const targetProduct
      if (targetProduct){
          res.send()
      }else {
          next(createHttpError(404, `Product with the id of ${req.params.productId} not found!`))
      }
    } catch (error) {
      next(error);
    }
  });
