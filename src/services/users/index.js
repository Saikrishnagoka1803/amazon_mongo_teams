import express from "express"
import createHttpError from "http-errors"
import UserModel from "./schema.js"
import productModel from "../products/index.js"


const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body) // here happens validation of the req.body, if it is not ok Mongoose will throw a "ValidationError"
    const { _id } = await newUser.save() // this is where the interaction with the db/collection happens

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find()

    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId

    const user = await UserModel.findById(userId) 

    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId
    const modifiedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true, // returns the modified user
    })

    if (modifiedUser) {
      res.send(modifiedUser)
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId

    const deletedUser = await UserModel.findByIdAndDelete(userId)

    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

/////////////////////////////////////////////////////////////////////////////

usersRouter.post("/:userId/purchaseHistory", async (req, res, next) => {
  try {
    // We are receiving the bookId from req.body. Given the id of that book we want to insert the corresponding book's data into the purchase history (array which belongs to the specified :userId)

    // 1. Find the book by id

    const purchasedBook = await BookModel.findById(req.body.bookId, { _id: 0 }) // findById(query, projection)

    if (purchasedBook) {
      // 2. If the book is found we are going to add additional info like purchaseDate

      const bookToInsert = { ...purchasedBook.toObject(), purchaseDate: new Date() } // purchasedBook is a DOCUMENT not a normal object, therefore when I want to spread that I need to convert it into a plain JS Object

      // 3. Update the specified user record by adding (pushing) the book to the history
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.userId, // WHO we want to modify
        { $push: { purchaseHistory: bookToInsert } }, // HOW we want to modify him/her
        { new: true }
      )

      if (updatedUser) {
        res.send(updatedUser)
      } else {
        next(createHttpError(404, `User with id ${req.params.userId} not found!`))
      }
    } else {

      next(createHttpError(404, `Book with id ${req.body.bookId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId/purchaseHistory", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    if (user) {
      res.send(user.purchaseHistory)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId/purchaseHistory/:purchasedId", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    if (user) {
      const purchasedItem = user.purchaseHistory.find(book => book._id.toString() === req.params.purchasedId) // I CANNOT compare an ObjectId (_id) with a string, _id needs to be converted into a string
      if (purchasedItem) {
        res.send(purchasedItem)
      } else {
        next(createHttpError(404, `Book with id ${req.params.purchasedId} not found in purchase history!`))
      }
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId/purchaseHistory/:purchasedId", async (req, res, next) => {
  try {
    // const user = await UserModel.findOneAndUpdate(
    //   { _id: req.params.userId, "purchaseHistory._id": req.params.purchasedId },
    //   {
    //     "purchaseHistory.$": req.body, // $ is the POSITIONAL OPERATOR, it represents the index of the book found in the query ("purchaseHistory._id": req.params.purchasedId )
    //   },
    //   { new: true }
    // )
    // purchaseHistory = [{}, {}, {}, {} ]
    // purchaseHistory[2] = req.body
    // if (user) {
    //   res.send(user)
    // } else {
    //   next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    // }

    const user = await UserModel.findById(req.params.userId) // user is a MONGOOSE DOCUMENT not a normal plain JS object

    if (user) {
      const index = user.purchaseHistory.findIndex(p => p._id.toString() === req.params.purchasedId)

      if (index !== -1) {
        user.purchaseHistory[index] = { ...user.purchaseHistory[index].toObject(), ...req.body }
        await user.save()
        res.send(user)
      } else {
        next(createHttpError(404, `Book with id ${req.params.purchasedId} not found in purchase history!`))
      }
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId/purchaseHistory/:purchasedId", async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId, // WHO we want to modify
      { $pull: { purchaseHistory: { _id: req.params.purchasedId } } }, // HOW we want to modify that user (remove a specified item from the purchaseHistory array)
      { new: true } // options
    )
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter;