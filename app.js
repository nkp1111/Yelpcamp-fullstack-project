const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const flash = require("connect-flash")
// custom error class
const { ExpressError } = require("./utils/expressError")
// Express router
const campgrounds = require("./routes/campgrounds")
const reviews = require("./routes/reviews")


// mongoose connection
mongoose.set("strictQuery", false)
mongoose.connect(process.env["MONGO_URI"])
  .then(() => {
    console.log("Mongoose connected")
  })
  .catch((err) => {
    console.log("error")
    console.log(err)
  })


// configuration for express session middleware
const sessionConfig = {
  secret: process.env["SESSION_SECRET_KEY"],
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}

// basic app configuration
app.engine("ejs", ejsMate)
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

// app middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(__dirname + "/public"))
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})

// app routes
app.get("/", (req, res) => {
  res.render("home")
})

// campground routes
app.use("/campground", campgrounds)

// reviews routes
app.use("/campground/:id/reviews/", reviews)

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