// database model
const { Campground } = require("../models/campground")
const { cloudinary } = require("../cloudinary")
const axios = require("axios")

// view all campgrounds
const index = async (req, res) => {
  let campgrounds = await Campground.find({})
  res.render("campground/index", { campgrounds })
}

// render create new campground form
const renderNewForm = (req, res) => {
  res.render("campground/new")
}

// create new campground
const createNewCamp = async (req, res, next) => {
  let newCamp = new Campground({
    ...req.body
  })

  // get geocoded data for location
  const positionStackUrl = `http://api.positionstack.com/v1/forward?access_key=${process.env["POSITION_STACK_API"]}&query=${req.body.location}`
  let lat, long
  await axios.get(positionStackUrl)
    .then(data => {
      if (data.data.data.length) {
        const { latitude, longitude } = data.data.data[0]
        lat = latitude
        long = longitude
      }
    })
  // if location latitude or longitude is not proper
  if (!lat || !long) {
    req.flash("error", "Please provide proper 'location' name")
    return res.redirect("/campground/new")
  }
  // set campground geometry geojson data
  newCamp.geometry = { type: "Point", coordinates: [lat, long] }

  newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
  newCamp.author = req.user._id
  newCamp = await newCamp.save()
  // console.log(newCamp)
  req.flash("success", "Successfully made a new campground")
  res.redirect(`/campground/${newCamp._id}`)
}

// render edit campground form
const renderEditForm = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash("error", "Campground cannot be found!")
    return res.redirect("/campground")
  }
  res.render("campground/edit", { campground })
}

// edit campground
const editCamp = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body })
  campground.images.push(...req.files.map(f => ({ url: f.path, filename: f.filename })))
  await campground.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      // check seed image
      if (filename !== ".") {
        // delete cloudinary stored images
        await cloudinary.uploader.destroy(filename)
      }
    }
    // remove images from database
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
  req.flash("success", "Successfully updated campground")
  res.redirect(`/campground/${id}`)
}

// delete a campground
const deleteCamp = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash("success", "Successfully deleted campground")
  res.redirect("/campground")
}

// view one campground detail
const detailCampView = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  }).populate("author")
  if (!campground) {
    req.flash("error", "Campground cannot be found!")
    return res.redirect("/campground")
  }
  res.render("campground/show", { campground })
}

module.exports = {
  index,
  renderNewForm,
  createNewCamp,
  renderEditForm,
  editCamp,
  deleteCamp,
  detailCampView,
}