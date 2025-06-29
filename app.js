const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("C:/MajorProject/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("C:/MajorProject/utils/wrapAsync.js");
const ExpressError = require("C:/MajorProject/utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User= require("./models/user.js");
const Review = require("./models/review.js");



const reviewRouter = require("C:/MajorProject/models/review.js");
const listingRouter = require("./routes/listing.js")
const userRouter = require("C:/MajorProject/routes/user.js");



const sessionOptions = {
    secret: "my_super_secret_code",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,    // 7-> days, 24-> hours, 60-> minutes, 60-> seconds, 1000-> miliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
};

app.get("/", (req, res) => {
    res.send("Hello, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
});


const MONGO_URL = "mongodb://127.0.0.1:27017/Journey_Weaver";

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));




const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


app.use("/listings", listingRouter);
app.use("/", userRouter);


app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
});


//Review route
//Post route



app.post("/listings/:id/reviews", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // ✅ THIS IS ESSENTIAL
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`);
}));


//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Deleted review ");

    res.redirect(`/listings/${id}`);
}));



app.listen(8080, () => {
    console.log("Server is listening....");
});

