const Customer = require("../models/customer.model");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");

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
  console.log(message);
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
    }
    else if(!user.active)
    {
      var cartTotal = 0;
      var user = null;
      res.cookie("message", { message: "Please verify your email", type: "fail" });
      res.redirect("/login");
    } 
    else {
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

exports.postChangePassword = async (req, res, next) => {
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
  
  const currentPassword =  req.body?.password
  var checkPassword = bcrypt.compareSync(currentPassword, user.password);
  console.log(checkPassword);
  if(checkPassword)
  {
    const newPassword = await bcrypt.hash(req.body?.newPassword, 12);
    Customer.updateOne({ _id: user._id }, {password: newPassword}, (error) =>
    {
      if(!error)
      {
        res.clearCookie("cusToken");
        res.cookie("message", { message: "Change Password Successfully", type: "success" });
        res.redirect("login");
      }
      else{
        res.cookie("message", { message: "Update fail", type: "fail" });
        res.redirect("changepassword");
      }
    });
  }
  else{
    res.cookie("message", { message: "Your current password is wrong", type: "error" });
    res.redirect("changepassword");
  }
}

exports.checkExistUser = (req, res, next) => {
  const token = req.cookies?.cusToken || "";

  jwt.verify(token, process.env.KEY_JWT, (err, data) => {
    if (err) {
      const message = {
        message: "Please Login",
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
  const message = {
    message: "Logout successfully",
    type: "success",
  };
  res.cookie("message", message);
  res.redirect("/login");
};
