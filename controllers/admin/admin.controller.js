const Admin = require("../../models/admin.model");
const firebase = require("../../services/firebase");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { ADMIN_MODEL } = require("../../constants/modal");
const { ITEM_PAGE } = require("../../constants/variables");

dotenv.config();

exports.getAdmin = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let admin = [];

  if (search) {
    admin = await Admin.find({
      adminName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    admin = await Admin.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(admin.length / ITEM_PAGE);
  const totalPage = admin.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = admin.length ? page : 0;
  admin = admin.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/admins", {
    pageName: "admin",
    admin,
    adminModel: ADMIN_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.postAdmin = async (req, res, next) => {
  let page = req.body.page || 1;
  let search = req.query.search || "";
  let admin = [];

  if (!req.body.page) {
    const urlAvatar = await firebase.uploadImage(req.files[0]);

    admin = {
      adminName: req.body.adminName,
      identityCard: req.body.identityCard,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      username: req.body.username,
      password: "Admin@" + req.body.identityCard,
      dateOfBirth: req.body.dateOfBirth,
      avatarLink: urlAvatar,
      aboutMe: req.body.aboutMe,
    };

    const newAdmin = new Admin(admin);
    await newAdmin.save();
  }

  if (search) {
    admin = await Admin.find({
      adminName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .exec();

    search = "?search=" + search;
  } else {
    admin = await Admin.find().sort({ createdAt: -1 }).exec();
  }

  const getPage = Math.floor(admin.length / ITEM_PAGE);
  const totalPage = admin.length % ITEM_PAGE != 0 ? getPage + 1 : getPage;
  const nextPage = parseInt(page) + 1;
  const prevPage = parseInt(page) - 1;
  const numPage = admin.length ? page : 0;
  admin = admin.slice((page - 1) * ITEM_PAGE, page * ITEM_PAGE);

  res.render("admin/admins", {
    pageName: "admin",
    admin,
    adminModel: ADMIN_MODEL,
    page,
    totalPage,
    nextPage,
    prevPage,
    numPage,
    search,
  });
};

exports.updateAdmin = async (req, res, next) => {
  try {
    const isMe = jwt.verify(
      req.cookies?.token,
      process.env.KEY_JWT,
      (err, data) => {
        if (err) return [];
        return data;
      }
    );

    let user = {};
    let update;
    const adminId = req.params.id || "";

    switch (Object.keys(req.body)[0]) {
      case ADMIN_MODEL.avatarLink:
        update = await Admin.updateOne(
          { _id: adminId },
          {
            $set: {
              avatarLink: req.body.avatarLink,
            },
          }
        );
        break;
      default:
        let adminProperty = { $set: {} };
        adminProperty["$set"][Object.keys(req.body)[0]] =
          req.body[Object.keys(req.body)[0]] || "";

        update = await Admin.updateOne({ _id: adminId }, adminProperty);
        break;
    }

    if (isMe._id == adminId && update?.modifiedCount != 0) {
      user = await Admin.findById({ _id: adminId });

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
      res.send({ user, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.deleteAdmin = async (req, res, next) => {
  const adminId = req.params.id;
  Admin.findByIdAndDelete({ _id: adminId }, (err, data) => {
    if (!err) {
      firebase.deleteImage(data.avatarLink);
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });
};

exports.lockAdmin = (req, res, next) => {
  try {
    const adminId = req.params.id;
    const isMe = jwt.verify(
      req.cookies?.token,
      process.env.KEY_JWT,
      (err, data) => {
        if (err) return [];
        return data;
      }
    );
    let update;
    if (isMe._id != adminId) {
      Admin.findById({ _id: adminId }, async (err, data) => {
        if (!err) {
          update = await Admin.updateOne(
            { _id: adminId },
            { $set: { status: !data.status } }
          );
        }

        if (update?.modifiedCount != 0) {
          res.send({ status: !data.status, success: true });
        } else {
          res.send({ success: false });
        }
      });
    } else {
      res.send({ success: false });
    }
  } catch (error) {}
};

exports.getAdminbyUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const findAdmin = await Admin.findOne({ username: username });
    if (findAdmin) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {}
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

exports.resetPasswordAdmin = async (req, res, next) => {
  const id = req.params.id;
  Admin.findById({ _id: id }, async (err, data) => {
    if (!err) {
      const newPassword = await bcrypt.hash("Admin" + "123", 12);
      const update = await Admin.updateOne(
        { _id: id },
        { password: newPassword }
      );
      if (update?.modifiedCount > 0) {
        res.send({ success: true });
      }
    } else {
      res.send({ success: false });
    }
  });
};
