import express, { Router } from "express"
import mongoose from "mongoose"
import Products from "./schema.js"

const router = express.Router()

// GET all products
router.get("/", async (req, res, next) => {
    try {
        const products = await Products.find({})
        res.send(products)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})


// GET product by id
router.get("/:id", async (req, res, next) => {
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
        res.send(500).send({ message: error.message })
    }
})


// POST product
router.post("/", async (req, res, next) => {
    try {
        const product = await new Products(req.body).save()
        res.status(201).send(blog)
    } catch (error) {
        console.log(error)
        res.send(500).send({ message: error.message })
    }
})


// DELETE product
router.delete("/:id", async (req, res, next) => {
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
        res.send(500).send({ message: error.message })
    }
})


// PUT product
router.put("/:id", async (req, res, next) => {
    try {
        const updated = await Products.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        res.send(updated)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})


export default router;