const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema({
    content: {
        type: String,
        required: true
    },
    cusId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: false
    },
    cusName: {
        type: String,
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: "Comment",
});

module.exports = mongoose.model("Comment", Comment);