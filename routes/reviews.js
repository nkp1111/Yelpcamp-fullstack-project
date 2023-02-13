const express = require("express")
const router = express.Router({ mergeParams: true })

// wrapper function for async errors
const catchAsync = require("../utils/catchAsync")
// middleware for authentication
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")
// controller
const reviews = require("../controllers/reviews")


router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router