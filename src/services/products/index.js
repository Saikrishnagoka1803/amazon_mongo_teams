import express, { Router } from "express"
import mongoose from "mongoose"
import Products from "./schema.js"


const productRouter = express.Router()

// GET all products
productRouter.get("/", async (req, res, next) => {
    try {
        const products = await Products.find({})
        res.send(products)
    } catch (error) {
        next(error)
    }
})


// GET product by id
productRouter.get("/:id", async (req, res, next) => {
    try {
        const product = await Products.findById(req.params.id)
        if (!product) {
            res
                .status(404)
                .send({ message: `product with ${req.params.id} is not found!` })
        } else {
            res.send(product)
        }
    } catch (error) {
        next(error)
    }
})


// POST product
productRouter.post("/", async (req, res, next) => {
    try {
        console.log(req)
        const product = await new Products(req.body).save()
        res.status(201).send(product)
    } catch (error) {
        next(error)
    }
})


// DELETE product
productRouter.delete("/:id", async (req, res, next) => {
    try {
        const product = await Products.findById(req.params.id)
        if (!product) {
            res
                .status(404)
                .send({ message: `product with ${req.params.id} is not found!` })
        } else {
            await Products.findByIdAndDelete(req.params.id)
            res.status(204).send()
        }
    } catch (error) {
        next(error)
    }
})


// PUT product
productRouter.put("/:id", async (req, res, next) => {
    try {
        const updated = await Products.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        res.send(updated)
    } catch (error) {
        next(error)
    }
})


export default productRouter