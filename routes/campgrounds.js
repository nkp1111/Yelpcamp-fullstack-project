const express = require("express")
const router = express.Router()

// wrapper function for async errors
const catchAsync = require("../utils/catchAsync")
// middleware for authentication
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")
// controller
const campground = require("../controllers/campground")


router.get("/", catchAsync(campground.index))

router.get("/new", isLoggedIn, campground.renderNewForm)

router.post("/", isLoggedIn, validateCampground, catchAsync(campground.createNewCamp))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campground.editCamp))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campground.deleteCamp))

router.get("/:id", catchAsync(campground.detailCampView))

module.exports = router