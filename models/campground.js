const mongoose = require("mongoose")
const { campgroundSchema } = require("../schemas")
const { Review } = require("./reviews")

const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
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