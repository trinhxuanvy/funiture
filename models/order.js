const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
    orderNote: {
        type: String,
        required: false,
    },
    shipping: {
        type: Number,
        required: true,
    },
    subTotalPrice: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    receiverAddr: {
        type: String,
        required: true,
    },
    receiverPhone: {
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
    promotionValue: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        enum: {
            values: ["order", "prepare", "ship", "paid", "cancel"],
            message: "{VALUE} is not support.",
            default: "order"
        },
    },
    orderDetail: [{
        amount: {
            type: Number,
            default: 0,
            min: 0
        },
        price: {
            type: Number,
            required: true
        },
        prodId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        prodName: {
            type: String,
            required: true
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        categoryName: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true,
    versionKey: false,
    collection: "Order",
});

module.exports = mongoose.model("Order", Order);