// database models
const { Campground } = require("../models/campground")
const { Review } = require("../models/reviews")

// create a new review for a campground
const createReview = async (req, res) => {
  const { id } = req.params
  const review = new Review({ ...req.body })
  review.author = req.user._id
  const campground = await Campground.findById(id)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  req.flash("success", "Successfully added new review")
  res.redirect(`/campground/${id}`)
}

// delete a review from the campground
const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "Successfully deleted review")
  res.redirect(`/campground/${id}`)
}

module.exports = {
  createReview,
  deleteReview,
}