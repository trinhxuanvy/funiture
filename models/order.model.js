const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    orderNote: {
      type: String,
      required: false,
    },
    shipping: {
      type: Number,
      default: 20,
      required: true,
    },
    subTotalPrice: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
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
    commune: {
      type: String,
      required: false,
      default: "",
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    receiverPhone: {
      type: String,
      required: true,
    },
    receiverMail: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    cusId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    couponCode: {
      type: String,
      required: false,
    },
    discountMoney: {
      type: Number,
      default: 0,
      required: false,
    },
    status: {
      type: String,
      enum: {
        values: ["order", "prepare", "ship", "paid", "cancel"],
        message: "{VALUE} is not support.",
      },
      default: "order",
    },
    orderDetail: [
      {
        amount: {
          type: Number,
          default: 0,
          min: 0,
        },
        price: {
          type: Number,
          required: true,
        },
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Order",
  }
);

module.exports = mongoose.model("Order", Order);
