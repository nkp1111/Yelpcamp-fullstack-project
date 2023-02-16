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
// Express routes
const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews")
const userRoutes = require("./routes/user")
// database model
const { User } = require("./models/user")
// passport
const passport = require("passport")
const LocalStrategy = require("passport-local")

const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")

const MongoDBStore = require("connect-mongo")


// mongoose connection
const mongoURI = process.env["MONGO_URI"]
mongoose.set("strictQuery", false)
mongoose.connect(mongoURI)
  .then(() => {
    console.log("Mongoose connected")
  })
  .catch((err) => {
    console.log("error")
    console.log(err)
  })


// mongo store
let store = MongoDBStore.create({
  mongoUrl: mongoURI,
  secret: "Abadsecret",
  touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
  console.log("session store error", e)
})

// configuration for express session middleware
const sessionConfig = {
  store: store,
  name: "session",
  secret: process.env["SESSION_SECRET_KEY"],
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
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
app.use(passport.initialize())
app.use(passport.session())
app.use(mongoSanitize())

// helmet
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://unpkg.com/leaflet@1.9.3/",
  "https://unpkg.com/leaflet.markercluster@1.4.1/",
];
const styleSrcUrls = [
  "https://kit.fontawesome.com/",
  "https://kit-free.fontawesome.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://unpkg.com/leaflet@1.9.3/",
  "https://unpkg.com/leaflet.markercluster@1.4.1/",
];
const connectSrcUrls = [
  "https://kit.fontawesome.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/",
        "https://images.unsplash.com/",
        "https://unpkg.com/leaflet@1.9.3/",
        "https://a.tile.openstreetmap.org/",
        "https://b.tile.openstreetmap.org/",
        "https://c.tile.openstreetmap.org/",
        "https://tile.openstreetmap.org/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
    crossOriginEmbedderPolicy: false
  })
);


passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  if (!["/", "/login"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl
  }
  res.locals.currentUser = req.user
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})

// app routes
app.get("/", (req, res) => {
  res.render("home")
})

// user route
app.use("/", userRoutes)

// campground route
app.use("/campground", campgroundRoutes)

// review route
app.use("/campground/:id/reviews", reviewRoutes)


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

app.listen(process.env["PORT"] || 3000, () => {
  console.log("App is listening on port 3000");
})