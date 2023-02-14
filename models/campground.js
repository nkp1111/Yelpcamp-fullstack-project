const mongoose = require("mongoose")
const { Review } = require("./reviews")

const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  images: [
    { url: String, filename: String },
  ],
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