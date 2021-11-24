const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Coupon = new Schema({
    code: {
        type: String,
        required: true
    },
    promotionValue: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: "Coupon",
});

module.exports = mongoose.model("Coupon", Coupon);