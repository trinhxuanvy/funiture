const mongooes = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongooes.Schema;

const Admin = new Schema(
  {
    adminName: {
      type: String,
      required: true,
    },
    identityCard: {
      type: String,
      required: false,
      default: "",
    },
    phone: {
      type: String,
      required: false,
      default: "",
    },
    email: {
      type: String,
      required: false,
      default: "",
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: false,
      default: "",
    },
    avatarLink: {
      type: String,
      required: false,
      default: "",
    },
    roleLevel: {
      type: String,
      required: false,
      enum: ["1", "2", "3"], // 1: quản lý cấp cao nhất
      default: "1",
    },
    aboutMe: {
      type: String,
      required: false,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
      default: "",
      required: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Admin",
  }
);

Admin.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 12);
});

Admin.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongooes.model("Admin", Admin);
