const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
// wrapper function for async errors
const catchAsync = require("./utils/catchAsync")
// custom error class
const { ExpressError } = require("./utils/expressError")
// database models
const { Campground } = require("./models/campground")
const { Review } = require("./models/reviews")
// joi schemas for validation
const { reviewSchema } = require("./schemas")
// Express router
const campgrounds = require("./routes/campgrounds")

// mongoose connection
mongoose.connect(process.env["MONGO_URI"])
  .then(() => {
    console.log("Mongoose connected")
  })
  .catch((err) => {
    console.log("error")
    console.log(err)
  })

// basic app configuration
app.engine("ejs", ejsMate)
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

// app middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    let message = error.details.map(item => item.message).join(", ")
    throw new ExpressError(message, 400)
  } else {
    next()
  }
}

// app routes
app.get("/", (req, res) => {
  res.render("home")
})

// campground routes
app.use("/campground", campgrounds)


// create a new review for a campground
app.post("/campground/:id/reviews", validateReview, catchAsync(async (req, res) => {
  const { id } = req.params
  const review = Review({ ...req.body })
  const campground = await Campground.findById(id)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  res.redirect(`/campground/${id}`)
}))

// delete a review from the campground
app.delete("/campground/:id/reviews/:reviewId", catchAsync(async (req, res) => {
  const { id, reviewId } = req.params
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/campground/${id}`)
}))


// unknown routes not defined in server
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404))
})

// custom error route
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) {
    err.message = "Something Went Wrong"
  }
  res.status(statusCode).render("error", { err })
})

app.listen("3000", () => {
  console.log("App is listening on port 3000");
})