const mongoose = require("mongoose")
const { Review } = require("./reviews")

const Schema = mongoose.Schema

const ImageSchema = new Schema({
  url: String,
  filename: String,
})

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200")
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
}, opts)

// virtual to return link for cluster map
CampgroundSchema.virtual("popUpMarkup").get(function () {
  return `
  <strong>
  <a href='/campground/${this._id}'>${this.title}</a>
  </strong>
  <p>${this.description.substring(0, 30)}</p>
  `
})


// middleware to delete all reviews of deleted campground
CampgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

const Campground = mongoose.model("Campground", CampgroundSchema)

module.exports = {
  Campground,
}