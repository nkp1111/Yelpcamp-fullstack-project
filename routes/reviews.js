const express = require("express")
const router = express.Router({ mergeParams: true })
// database models
const { Campground } = require("../models/campground")
const { Review } = require("../models/reviews")
// wrapper function for async errors
const catchAsync = require("../utils/catchAsync")
// middleware for authentication
const { validateReview, isLoggedIn } = require("../middleware")
// // custom error class
// const { ExpressError } = require("../utils/expressError")

// create a new review for a campground
router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const { id } = req.params
  const review = new Review({ ...req.body })
  review.author = req.user._id
  const campground = await Campground.findById(id)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  req.flash("success", "Successfully added new review")
  res.redirect(`/campground/${id}`)
}))

// delete a review from the campground
router.delete("/:reviewId", catchAsync(async (req, res) => {
  const { id, reviewId } = req.params
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "Successfully deleted review")
  res.redirect(`/campground/${id}`)
}))

module.exports = router