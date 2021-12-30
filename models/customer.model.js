const mongooes = require("mongoose");
const Schema = mongooes.Schema;
const bcrypt = require("bcrypt");

const Customer = new Schema(
  {
    cusName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
    province: {
      type: String,
      required: false,
      default: "",
    },
    district: {
      type: String,
      required: false,
      default: "",
    },
    ward: {
      type: String,
      required: false,
      default: "",
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
    cart: {
      cartDetails: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          productName: {
            type: String,
            required: true,
          },
          productImg: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: false,
            default: 1,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      totalQuantity: {
        type: Number,
        default: 0,
        required: false,
      },
      price: {
        type: Number,
        required: false,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Customer",
  }
);

Customer.methods.validPassword = function (password) {
  console.log(bcrypt.compareSync(password, this.password));
  return bcrypt.compareSync(password, this.password);
};

Customer.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 12);
});

module.exports = mongooes.model("Customer", Customer);
