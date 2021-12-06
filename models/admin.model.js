const mongooes = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongooes.Schema;

const Admin = new Schema(
  {
    adminName: {
      type: String,
      required: false,
    },
    identityCard: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    avatarLink: {
      type: String,
      required: false,
    },
    roleLevel: {
      type: String,
      required: false,
      enum: ["1", "2", "3"], // 1: quản lý cấp cao nhất
    },
    aboutMe: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: "Admin",
  }
);

Admin.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongooes.model("Admin", Admin);
