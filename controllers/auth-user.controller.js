const Customer = require("../models/customer.model");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const passport = require("passport");

dotenv.config();

exports.getLogin = async (req, res, next) => {

    const user = jwt.verify(
        req.cookies?.cusToken,
        process.env.KEY_JWT,
        function (err, data) {
          if (err) {
            return null;
          } else {
            return data;
          }
        }
      );

      var cartTotal = 0;
      if(user != null)
      {
        cartTotal = user.cart.totalQuantity;
      }
      else
      {
        cartTotal = req.session.totalQuantity;
      }

  const message = req.cookies?.message || "",
    username = "",
    password = "";
  if (message) {
    res.clearCookie("message");
  }
  res.render("login", { message, username, password, user, cartTotal });
};

exports.postLogin = async (req, res, next) => {
  const username = req.body?.username;
  const password = req.body?.password;
  passport.authenticate("local.customer.login", function (err, user, info) {
    if (info) {
      var cartTotal = 0;
      var user = null;
      res.render("login", { message: info, username, password, user, cartTotal });
    } else {
          const userToken = {
            _id: user._id,
            cusName: user.cusName,
            phone: user.phone,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            avatarLink: user.avatarLink,
            username: user.username,
            password: user.password,
            cart: user.cart,
            province: user.province,
            district: user.district,
            commune: user.commune,
            address: user.address,
          };

          const token = jwt.sign(userToken, process.env.KEY_JWT, {
            algorithm: "HS256",
            expiresIn: "1h",
          });

          res.cookie("cusToken", token);

          if (req.cookies?.oldUrl) {
            let oldUrl = req.cookies?.oldUrl;
            //res.cookie("oldUrl", oldUrl);
            res.redirect(oldUrl);
          } else {
            console.log("abcd1234");
            return res.redirect("/index");
          }
    }
  })(req, res, next);
};

exports.checkExpired = (req, res, next) => {
  const token = req.cookies?.cusToken || "";

  jwt.verify(token, process.env.KEY_JWT, (err, data) => {
    if (err) {
      const message = {
        message: "Your account has expired",
        type: "warning",
      };

      res.cookie("message", message);
      res.redirect("/login");
    } else {
      next();
    }
  });
};

exports.getLogout = async (req, res, next) => {
  res.clearCookie("cusToken");
  res.redirect("/login");
};
