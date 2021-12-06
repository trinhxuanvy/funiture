require("./config/passport");

const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const shopRouter = require("./routes/shop.route");
const adminRouter = require("./routes/admin.route");
const authAdminRouter = require("./routes/auth-admin.route");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "mrtrinh",
    cookie: { maxAge: 60000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(shopRouter);
app.use(adminRouter);
app.use(authAdminRouter);

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.CONNECT_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Can't connect to database");
  });

app.listen(port, () => {
  console.log("Listening at port " + port);
});
