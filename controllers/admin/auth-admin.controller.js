const Admin = require("../../models/admin.model");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { ADMIN_MODEL } = require("../../constants/modal");
const bcrypt = require("bcrypt");
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

exports.checkExistUser = (req, res, next) => {
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

exports.profile = async (req, res, next) => {
  const user = jwt.verify(
    req.cookies?.token,
    process.env.KEY_JWT,
    function (err, data) {
      if (err) {
        return {};
      } else {
        return data;
      }
    }
  );

  const date = new Date(user?.dateOfBirth);
  user.dateOfBirth =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

  const message = req.cookies.message;
  res.clearCookie("message");

  res.render("admin/profile", {
    pageName: "profile",
    user,
    adminModel: ADMIN_MODEL,
    type: req.query?.type,
    message,
  });
};

exports.updateProfile = async (req, res, next) => {
  const admin = jwt.verify(
    req.cookies.token,
    process.env.KEY_JWT,
    (err, data) => {
      if (!err) {
        return data;
      }
    }
  );
  const aboutMe = req.body.aboutMe ? req.body.aboutMe : admin.aboutMe;
  let newAdmin = {};
  let update;

  if (req.body?.password) {
    const newPassword = await bcrypt.hash(req.body?.password, 12);
    newAdmin = {
      password: newPassword,
    };
  } else {
    newAdmin = {
      email: req.body.email,
      adminName: req.body.adminName,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      identityCard: req.body.identityCard,
      address: req.body.address,
      aboutMe: aboutMe,
    };
  }

  update = await Admin.updateOne({ _id: admin._id }, newAdmin);
  if (update?.modifiedCount) {
    const user = await Admin.findById({ _id: admin._id });

    const userToken = {
      _id: user._id,
      adminName: user.adminName,
      phone: user.phone,
      email: user.email,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      avatarLink: user.avatarLink,
      username: user.username,
      password: user.password,
      aboutMe: user.aboutMe,
      roleLevel: user.roleLevel,
      avatarLink: user.avatarLink,
      roleLevel: user.roleLevel,
      identityCard: user.identityCard,
    };

    const token = jwt.sign(userToken, process.env.KEY_JWT, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.cookie("token", token);
    res.cookie("message", { message: "Update Success", type: "success" });
  }

  res.redirect("/admin/profile");
};

exports.updateImageProfile = async (req, res, next) => {
  const admin = jwt.verify(
    req.cookies.token,
    process.env.KEY_JWT,
    (err, data) => {
      if (!err) {
        return data;
      }
    }
  );

  const avatarLink = req.body?.avatarLink || admin.avatarLink;
  let update = await Admin.updateOne(
    { _id: admin._id },
    { avatarLink: avatarLink }
  );
  let user = [];

  if (update?.modifiedCount) {
    user = await Admin.findById({ _id: admin._id });

    const userToken = {
      _id: user._id,
      adminName: user.adminName,
      phone: user.phone,
      email: user.email,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      avatarLink: user.avatarLink,
      username: user.username,
      password: user.password,
      aboutMe: user.aboutMe,
      roleLevel: user.roleLevel,
      avatarLink: user.avatarLink,
      roleLevel: user.roleLevel,
      identityCard: user.identityCard,
    };

    const token = jwt.sign(userToken, process.env.KEY_JWT, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.cookie("token", token);
  }

  if (user) {
    res.send({ userToken, success: true });
  } else {
    res.send({ success: false });
  }
};
