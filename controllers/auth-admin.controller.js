const Admin = require("../models/admin.model");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const passport = require("passport");

dotenv.config();

exports.getLogin = async (req, res, next) => {
  const message = req.cookies?.message || "",
    username = "",
    password = "";
  if (message) {
    res.clearCookie("message");
  }
  res.render("admin/login", { message, username, password });
};

exports.postLogin = async (req, res, next) => {
  const username = req.body?.username;
  const password = req.body?.password;
  passport.authenticate("local.admin.login", function (err, user, info) {
    if (info) {
      res.render("admin/login", { message: info, username, password });
    } else {
      const userToken = {
        _id: user._id,
        adminName: user.adminName,
        phone: user.phone,
        email: user.email,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        avatarLink: user.avatarLink,
        identityCard: user.identityCard,
        username: user.username,
        password: user.password,
        aboutMe: user.aboutMe,
        roleLevel: user.roleLevel,
        avatarLink: user.avatarLink,
        roleLevel: user.roleLevel,
      };

      const token = jwt.sign(userToken, process.env.KEY_JWT, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      res.cookie("token", token);

      if (req.cookies?.oldUrl) {
        let oldUrl = req.cookies?.oldUrl;
        res.cookie("oldUrl", oldUrl);
        res.redirect(oldUrl);
      } else {
        res.redirect("/admin/profile");
      }
    }
  })(req, res, next);
};

exports.checkExpired = (req, res, next) => {
  const token = req.cookies?.token || "";

  jwt.verify(token, process.env.KEY_JWT, (err, data) => {
    if (err) {
      const message = {
        message: "Your account has expired",
        type: "warning",
      };

      res.cookie("message", message);
      res.redirect("/admin/login");
    } else {
      if (!data.roleLevel) {
        res.redirect("/admin/login");
        return;
      }
      next();
    }
  });
};

exports.getLogout = async (req, res, next) => {
  res.clearCookie("token");
  res.redirect("/admin/login");
};
